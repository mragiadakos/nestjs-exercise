# cv-manager

## Table of Contents
- [Introduction](#introduction)
- [Installation](#installation)
- [Running the app](#running-the-app)
- [Test](#test)


## Introduction
CV-Manager is a REST-API that enables user authentication (sign-up, sign-in, sign-out) and provides CRUD operation for the user’s CV (each user can have at most one CV).</br>
Furthermore, when a user uploads a CV, it sends the CV to the CV-Processor for further processing.

## Installation

```bash
$ npm install
```

## Running the app
Before running the server, make sure the services that depends on are enabled. </br>
To enable the services, call docker-compose.
```bash
cd ..
docker-compose up -d

# (IMPORTANT!) create the tables on the DB
cd cv-manager
npm run migrate:dev
```

You can run the app from npm

```bash
# development
$ npm run start
# watch mode
$ npm run start:dev
# production mode
$ npm run start:prod
```

Or, you can run the app from docker
```bash
# build the image
docker build -t cv-manager .

# run the docker image connected to the docker-compose network
docker run --env-file .env.docker -p 3000:3000 --network kariera-cv-exercise_default -it cv-manager
```

## Test

```bash
# unit tests
$ npm run test
# e2e tests need the other services enabled
$ npm run test:e2e
# test coverage
$ npm run test:cov
```

