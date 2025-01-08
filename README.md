# API Gateway Microservices Project

This project sets up an API Gateway with multiple microservices, including authentication, user management, Kafka for messaging, MongoDB for data storage, and Redis for caching. The project is orchestrated using Docker Compose.

## Prerequisites

- Docker
- Docker Compose

## Services

### 1. Zookeeper
- **Image:** `confluentinc/cp-zookeeper:latest`
- **Ports:** 2181
- **Network:** `kafka-network`

### 2. Kafka
- **Image:** `confluentinc/cp-kafka:latest`
- **Ports:** 9092, 9093 (use in docker)
- **Depends on:** Zookeeper
- **Network:** `kafka-network`

### 3. Kafka UI (Kafdrop)
- **Image:** `obsidiandynamics/kafdrop`
- **Ports:** 9000
- **Depends on:** Kafka
- **Network:** `kafka-network`

### 4. MongoDB
- **Image:** `mongo`
- **Ports:** 27017
- **Environment:** `MONGO_INITDB_ROOT_USERNAME`, `MONGO_INITDB_ROOT_PASSWORD`
- **Network:** `db-network`

### 5. Mongo Express (Mongo UI)
- **Image:** `mongo-express`
- **Ports:** 8081
- **Depends on:** MongoDB
- **Network:** `db-network`

### 6. Redis
- **Image:** `redis:latest`
- **Ports:** 6379
- **Environment:** `REDIS_PASSWORD`
- **Command:** `redis-server --requirepass root`
- **Network:** `cache-network`

### 7. Redis Commander (Redis UI)
- **Image:** `rediscommander/redis-commander:latest`
- **Ports:** 8090
- **Depends on:** Redis
- **Environment:** `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`
- **Network:** `cache-network`

### 8. Auth Service
- **Build Context:** `./auth-microservice`
- **Target:** `prod` or `dev`
- **Depends on:** Kafka
- **Environment:** `JWT_SECRET`, `JWT_ACCESS_TOKEN_EXPIRES`, `JWT_REFRESH_TOKEN_EXPIRES`, `KAFKA_BROKER`, `KAFKA_CLIENT_ID`, `KAFKA_GROUP_ID`
- **Networks:** `gateway-network`, `kafka-network`

### 9. User Service
- **Build Context:** `./user-microservice`
- **Target:** `prod` or `dev`
- **Depends on:** Kafka, Redis, MongoDB
- **Environment:** `MONGO_HOST`, `MONGO_PORT`, `MONGO_USERNAME`, `MONGO_PASSWORD`, `MONGO_DATABASE`, `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`, `REDIS_DB`, `KAFKA_BROKER`, `KAFKA_CLIENT_ID`, `KAFKA_GROUP_ID`
- **Networks:** `gateway-network`, `kafka-network`, `cache-network`, `db-network`

### 10. API Gateway
- **Build Context:** `./api-gateway`
- **Target:** `prod` or `dev`
- **Depends on:** Kafka, Auth Service, User Service
- **Environment:** `APP_PORT`, `COOKIE_ACCESS_TOKEN_NAME`, `COOKIE_REFRESH_TOKEN_NAME`, `KAFKA_BROKER`, `KAFKA_CLIENT_ID`, `KAFKA_GROUP_ID`, `KAFKA_AUTH_SERVICE_GROUP_ID`, `KAFKA_USER_SERVICE_GROUP_ID`
- **Ports:** 3000
- **Networks:** `gateway-network`, `kafka-network`

#### Networks
- **gateway-network**
- **kafka-network**
- **db-network**
- **cache-network**

## How to Run

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd <your-repo-name>
   docker-compose up -d

2. **Access the services:**
    - **API Gateway Swagger**: http://localhost:3000/api
    - **Kafka UI**: http://localhost:9000
    - **Mongo Express UI**: http://localhost:8081
    - **Redis Commander UI**: http://localhost:8090
