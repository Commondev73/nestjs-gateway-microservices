# API Gateway Microservices Project

This project sets up an API Gateway with multiple microservices, including authentication, user management, Kafka for messaging, MongoDB for data storage, and Redis for caching. The project can be orchestrated using either Kubernetes with Helm or Docker Compose.

## Prerequisites

- Kubernetes
- Helm
- Docker
- Docker Compose

## Setup Instructions (Docker Compose)

### Services

#### 1. Zookeeper
- **Image:** `confluentinc/cp-zookeeper:latest`
- **Ports:** 2181
- **Network:** `kafka-network`

#### 2. Kafka
- **Image:** `confluentinc/cp-kafka:latest`
- **Ports:** 9092, 9093 (use in docker)
- **Depends on:** Zookeeper
- **Network:** `kafka-network`

#### 3. Kafka UI (Kafdrop)
- **Image:** `obsidiandynamics/kafdrop`
- **Ports:** 9000
- **Depends on:** Kafka
- **Network:** `kafka-network`

#### 4. MongoDB
- **Image:** `mongo`
- **Ports:** 27017
- **Environment:** `MONGO_INITDB_ROOT_USERNAME`, `MONGO_INITDB_ROOT_PASSWORD`
- **Network:** `db-network`

#### 5. Mongo Express (Mongo UI)
- **Image:** `mongo-express`
- **Ports:** 8081
- **Depends on:** MongoDB
- **Network:** `db-network`

#### 6. Redis
- **Image:** `redis:latest`
- **Ports:** 6379
- **Environment:** `REDIS_PASSWORD`
- **Command:** `redis-server --requirepass root`
- **Network:** `cache-network`

#### 7. Redis Commander (Redis UI)
- **Image:** `rediscommander/redis-commander:latest`
- **Ports:** 8090
- **Depends on:** Redis
- **Environment:** `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`
- **Network:** `cache-network`

#### 8. Auth Service
- **Build Context:** `./auth-microservice`
- **Target:** `prod` or `dev`
- **Depends on:** Kafka
- **Environment:** `JWT_SECRET`, `JWT_ACCESS_TOKEN_EXPIRES`, `JWT_REFRESH_TOKEN_EXPIRES`, `KAFKA_BROKER`, `KAFKA_CLIENT_ID`, `KAFKA_GROUP_ID`
- **Networks:** `gateway-network`, `kafka-network`

#### 9. User Service
- **Build Context:** `./user-microservice`
- **Target:** `prod` or `dev`
- **Depends on:** Kafka, Redis, MongoDB
- **Environment:** `MONGO_HOST`, `MONGO_PORT`, `MONGO_USERNAME`, `MONGO_PASSWORD`, `MONGO_DATABASE`, `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`, `REDIS_DB`, `KAFKA_BROKER`, `KAFKA_CLIENT_ID`, `KAFKA_GROUP_ID`
- **Networks:** `gateway-network`, `kafka-network`, `cache-network`, `db-network`

#### 10. API Gateway
- **Build Context:** `./api-gateway`
- **Target:** `prod` or `dev`
- **Depends on:** Kafka, Auth Service, User Service
- **Environment:** `APP_PORT`, `COOKIE_ACCESS_TOKEN_NAME`, `COOKIE_REFRESH_TOKEN_NAME`, `KAFKA_BROKER`, `KAFKA_CLIENT_ID`, `KAFKA_GROUP_ID`, `KAFKA_AUTH_SERVICE_GROUP_ID`, `KAFKA_USER_SERVICE_GROUP_ID`
- **Ports:** 3000
- **Networks:** `gateway-network`, `kafka-network`

### Networks
- **gateway-network**
- **kafka-network**
- **db-network**
- **cache-network**

### How to Run

1. **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd <your-repo-name>
    ```

2. **Bring up the services:**
    ```bash
    docker-compose up -d
    ```

3. **Access the services:**
    - **API Gateway Swagger:** http://localhost:3000/api
    - **Kafka UI:** http://localhost:9000
    - **Mongo Express UI:** http://localhost:8081
    - **Redis Commander UI:** http://localhost:8090

---

## Setup Instructions (Kubernetes and Helm)

### 1. Install Ingress NGINX

Add the Ingress NGINX repository and install the Ingress controller.

```sh
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

helm install ingress ingress-nginx/ingress-nginx --namespace ingress-nginx --create-namespace --set controller.replicaCount=1
```

### 2. Add Bitnami Repository and Install Charts

Add the Bitnami repository and install Kafka, Redis, and MongoDB.

```sh
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
```

#### Install Kafka

**Local Testing:**

```sh
helm install kafka bitnami/kafka --namespace kafka --create-namespace --set kafka.config.auto.create.topics.enable=true --set auth.enabled=false --set listeners.client.protocol=PLAINTEXT,listeners.controller.protocol=PLAINTEXT --set kafka.config."num.partitions"=3
```

**Advanced Setup:**

```sh
helm install kafka bitnami/kafka --namespace kafka --create-namespace -f kafka/values.yaml
```

#### Install Redis

**Local Testing:**

```sh
helm install redis bitnami/redis --namespace redis --create-namespace --set auth.enabled=true --set auth.password=root --set replica.replicaCount=1
```

**Advanced Setup:**

```sh
helm install redis bitnami/redis --namespace redis --create-namespace -f redis/values.yaml
```

#### Install MongoDB

**Local Testing:**

```sh
helm install mongo bitnami/mongodb --namespace mongo --create-namespace --set auth.rootUsername=root --set auth.rootPassword=root --set replicaSet.enabled=false
```

**Advanced Setup:**

```sh
helm install mongo bitnami/mongodb --namespace mongo --create-namespace -f mongo/values.yaml
```

#### API Gateway & Microservice 

```sh
kubectl apply -f k8s/namespace.yml

kubectl apply -f k8s/
```

#### Access the service
   - Open a web browser or use a tool like `curl` to access the `gateway` service via the `localhost\api` host.
