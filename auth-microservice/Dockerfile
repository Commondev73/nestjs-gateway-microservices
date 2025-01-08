# Stage 1: Build the application
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install -g @nestjs/cli
RUN npm ci

COPY . .

RUN npm run build



# Stage 2: Development stage
FROM node:22-alpine AS dev

ENV NODE_ENV=development

WORKDIR /app

COPY --from=build /app ./

RUN npm ci --only=development

# Create a non-root user and set the working directory
RUN addgroup -S nestjs && adduser -S nestjs -G nestjs
RUN chown -R nestjs:nestjs /app
USER nestjs:nestjs

CMD ["npm", "run", "start:dev"]



# Stage 3: Production stage
FROM node:22-alpine AS prod

ENV NODE_ENV=production

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules

# Create a non-root user and set the working directory
RUN addgroup -S nestjs && adduser -S nestjs -G nestjs
RUN chown -R nestjs:nestjs /app
USER nestjs:nestjs

CMD ["npm", "run", "start:prod"]
