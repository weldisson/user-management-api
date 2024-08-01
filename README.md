# User Management API
## Description

This is an API for user management, including operations for creating, updating, searching, and removing users. The API is built with NestJS and uses TypeORM to interact with a PostgreSQL database.

## Requirements
- Node.js (v20.15.0 or higher)
- Docker
- Docker Compose

## Installation
1. Clone the repository:
``` bash
$ git clone https://github.com/weldisson/user-management-api.git
$ cd user-management-api
```
2. install dependencies:
```bash
$ yarn install
```
3. Configure the environment:
```bash
$ cp .env.example .env
```

## Running the app

```bash
# start with docker
$ docker compose up

# starting only postgres on docker
$ docker compose up postgres

# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ docker compose up postgres
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## License

This project is licensed under the MIT License.
