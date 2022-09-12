# cv-processor

## Table of Contents
- [Introduction](#introduction)
- [Installation](#installation)
- [Running the app](#running-the-app)


## Introduction
CV-Processor is a small service that receives tasks from CV-Manager to process CV and send email to the users.

## Installation

```bash
$ npm install
```

## Running the app
Before running the server, make sure the CV-Manager and the other services are running. </br>

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
docker build -t cv-processor .

# run the docker image connected to the docker-compose network
docker run --env-file .env.docker -p 3005:3005 --network kariera-cv-exercise_default -it cv-processor
```


