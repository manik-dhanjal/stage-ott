<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>

## Stage Project

This repository is a Node.js application built with NestJS, a very powerful framework for building scalable and efficient server-side applications. It utilizes various technologies to ensure performance, reliability, and ease of deployment.

![https://github.com/manik-dhanjal/stage-ott/blob/master/assets/docs.png](https://github.com/manik-dhanjal/stage-ott/blob/master/assets/docs.png)

---

## Tech Stack:

- **Backend**: NestJS and Node.js
- **Database**: MongoDB
- **Caching**: Redis (or in-memory caching for local development)
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Deployment**: AWS Elastic Beanstalk
- **Testing**: Jest with Testcontainers for integration tests
- **CI/CD**: GitHub Actions
- **Authentication**: OAuth 2.0 with JWT

---

## Project Description

This project enhances an OTT platform by introducing a "My List" feature, allowing users to save their favorite movies and TV shows to a personalized list. The backend services manage the user's list, including adding, removing, and listing saved items.

Additionally, the project includes:

- **User Module**: Implements OAuth 2.0 for secure authentication and authorization.
- **OpenAPI Documentation**: Comprehensive API documentation using Swagger (accessible at [http://stage-ott.eu-north-1.elasticbeanstalk.com/oas-docs](http://stage-ott.eu-north-1.elasticbeanstalk.com/oas-docs)).

---

## Environment Variables:

The application requires the following environment variables to be set:

### Controller

- `PORT`: The port on which the application will listen (default: `3000`).

### Database

- `DB_URL`: The connection string for your MongoDB database.
- `MONGO_LOGGER_LEVEL`: The logging level for MongoDB operations (e.g., `info`, `debug`).

### User Authentication

- `USER_JWT_SECRET`: A secret key used for signing and verifying JWT tokens.
- `USER_ACCESS_JWT_EXPIRES_IN`: The expiration time for access tokens (e.g., `5m` for 5 minutes).
- `USER_REFRESH_JWT_EXPIRES_IN`: The expiration time for refresh tokens (e.g., `24h` for 24 hours).
- `USER_PASSWORD_SALT_ROUNDS`: The number of salt rounds for hashing passwords (default: `10`).

### Redis Caching

- `REDIS_HOST`: The hostname or connection string for your Redis server (e.g., `redis`).
- `REDIS_PORT`: The port on which your Redis server is running (default: `6379`).
- `REDIS_TTL`: The default expiration time for cached data in Redis (in seconds, default: `60`).

---

### Notes:

- Ensure these environment variables are set in your `.env` file or your deployment environment.
- For sensitive values like `USER_JWT_SECRET` and `DB_URL`, avoid hardcoding them in the codebase. Use environment variables or secret management tools.

---

## Features

### 1. **My List API**

- Add, remove, and fetch movies/TV shows from a user's personalized list.
- Optimized with database indexing and Redis caching for high performance.

### 2. **User Module**

- Implements OAuth 2.0 for secure authentication.
- Supports JWT-based access and refresh tokens.

### 3. **OpenAPI Documentation**

- Comprehensive API documentation is available at (accessible at [/oas-docs](http://stage-ott.eu-north-1.elasticbeanstalk.com/oas-docs))..
- Includes details for all endpoints, request/response schemas, and authentication requirements.

### 4. **Integration Tests**

- Uses Jest with Testcontainers to spin up real MongoDB and Redis containers for end-to-end testing.
- Ensures the application behaves as expected in a production-like environment.

## ![Integration Test](https://github.com/manik-dhanjal/stage-ott/blob/master/assets/integration-test.png)

## Performance

The application is designed to be highly performant, leveraging various optimizations such as Redis caching and database indexing to ensure low response times and high throughput.

### Key Optimizations:

1. **Redis Caching**:

   - Frequently accessed data, such as the user's "My List," is cached in Redis to reduce database load and improve response times.
   - Cache invalidation is implemented to ensure data consistency when items are added or removed from the list.

2. **Database Indexing**:

   - Critical fields like `userId` and `_id` are indexed in MongoDB to accelerate query performance.
   - Indexes ensure efficient lookups and reduce query execution time.

3. **Pagination**:

   - The `/api/v1/my-list` endpoint supports pagination to fetch data in smaller chunks, preventing large payloads and optimizing database queries.

4. **Optimized Query Design**:
   - Queries are designed to fetch only the necessary fields, reducing the amount of data transferred and processed.

---

### Observed Performance Metrics:

#### **Deployed Server (AWS Elastic Beanstalk)**:

- **Total Requests Sent**: 51,723
- **Requests/Second**: 85.15
- **Average Response Time**: 183 ms
- **P90**: 184 ms
- **P95**: 188 ms
- **P99**: 356 ms
- **Error Rate**: 0.00%

#### **Local Server**:

- **Total Requests Sent**: 10,473
- **Requests/Second**: 98.35
- **Average Response Time**: 4 ms
- **P90**: 5 ms
- **P95**: 7 ms
- **P99**: 14 ms
- **Error Rate**: 0.00%

---

## Stress Testing

The `/api/v1/my-list` endpoint was subjected to load testing using Postman. Below are the results:

#### **Deployed Server**:

- **Total Requests Sent**: 51,723
- **Requests/Second**: 85.15
- **Average Response Time**: 183 ms
- **P90**: 184 ms
- **P95**: 188 ms
- **P99**: 356 ms
- **Error Rate**: 0.00%

![Deployed Server Stress Test](https://github.com/manik-dhanjal/stage-ott/blob/master/assets/deployed-stress-test-report.png)

#### **Local Server**:

- **Total Requests Sent**: 10,473
- **Requests/Second**: 98.35
- **Average Response Time**: 4 ms
- **P90**: 5 ms
- **P95**: 7 ms
- **P99**: 14 ms
- **Error Rate**: 0.00%

![Local Server Stress Test](https://github.com/manik-dhanjal/stage-ott/blob/master/assets/local-stress-test-report.png)

---

### Additional Notes:

- **Cold Cache**: The first request to MongoDB may exhibit higher response times due to cold cache or database initialization overhead.
- **Scalability**: The application is designed to scale horizontally by adding more instances, leveraging Redis for distributed caching.
- **Environment Impact**: Performance metrics may vary depending on the deployment environment, network latency, and hardware resources.

---

### Conclusion:

The application demonstrates excellent performance under both local and deployed conditions. With Redis caching and database indexing, the average response times remain low, even under high load. These optimizations ensure a seamless user experience and efficient resource utilization.

---

## Running the Application

### Using Docker Compose:

This application uses Docker Compose to orchestrate three containers:

1. **Redis**: Used for caching frequently accessed data.
2. **MongoDB**: The database for storing application data.
3. **Backend Server**: The NestJS application that interacts with Redis and MongoDB.

#### Steps to Run:

1. Ensure you have Docker and Docker Compose installed on your system.

   - [Docker Installation Guide](https://docs.docker.com/get-docker/)
   - [Docker Compose Installation Guide](https://docs.docker.com/compose/install/)

2. Run the following command to build and start the containers:
   ````bash
   docker-compose up --build```
   ````

### Locally (Without Docker):

1. Install dependencies:

```bash
$ npm install
```

2. Run the application:

```bash
# Development
$ npm run start

# Watch mode
$ npm run start:dev

# Production mode
$ npm run start:prod
```

---

## Testing

Jest is used as the testing framework for this project. Integration tests are located in the `test` directory. You can run the tests locally using:

```bash
# Unit tests
$ npm run test

# End-to-end (e2e) tests
$ npm run test:e2e

# e2e tests with watch mode
$ npm run test:e2e:watch

# Test coverage
$ npm run test:cov
```

---

## CI/CD Workflow

This project uses GitHub Actions for automatic deployment to AWS when code is pushed to the `master` branch. The GitHub repository includes AWS secrets for seamless deployment.

---

## Deployment

This project is configured for deployment on AWS Elastic Beanstalk. The deployment steps include:

1. Creating an Elastic Beanstalk application.
2. Configuring environment variables.
3. Uploading the application code.

Refer to the AWS documentation for detailed instructions.

---

## License

This project is [MIT licensed](LICENSE).
