# kariera-cv-exercise

## Introduction
This is a simple system for users to store and manage their CVs.</br>
The system has six important services that communicate to each other through the network.</br>
However, only two of the services are the most significant.</br>
The first service contains a REST-API that enables user authentication (sign-up, sign-in, sign-out) and provides CRUD operation for the user’s CV (each user can have at most one CV).</br>
The second service processes all the CVs the users upload and emails them about the details of the CV.

## List of services
- MariaDB for storing user and CV information.
- MinIO for storing CV files.
- Redis for saving user's sessions and queue tasks.
- Smtp4dev for testing email.
- Adminer for looking at the data in MariaDB.
- CV-Manager for the REST-API.
- CV-Processor for processing CV and sending emails.

## List of ports used

The system will take these ports: 9001, 9000, 6379, 3306, 8080, 3080, 2525, 3000, 3005 </br>
Before starting the services, <span style="color:red">make sure you don't have any application that use any of these ports.</span>

## How to deploy everything
First, make sure you have docker-compose installed. </br>
After installing docker-compose, you have to build the docker images.
```shell
docker-compose -f docker-compose.yml -f docker-compose-services.yml build
```
Start all the services
```shell
docker-compose -f docker-compose.yml -f docker-compose-services.yml up -d
```

Create the SQL tables
```shell
cd cv-manager
npm run migrate:dev
```
Now you are ready to play with the system. 

## How to test everything
There are two options to play with the system.</br>
The first option is to try it out from [Swagger](http://localhost:3000/api).</br>
The second option is to try it out from Postman by importing the file 'kariera.postman_collection.json'</br>
Both contain some information on how to sign-up, login, and upload CV </br>

After you create a user, you can check the SQL data from [Adminer](http://localhost:8080/)</br>
For Adminer, the username and password is 'user'</br>

After uploading a CV, you can check the file from [MinIO console](http://localhost:9001/) and the email from [Smtp4dev](http://localhost:3080/)</br>
For MinIO console, add 'ROOTUSER' for username and 'CHANGEME123' for password.

## How to close everything
Because the system is based on docker-compose, just call this command line to close everything down.
```shell
docker-compose -f docker-compose.yml -f docker-compose-services.yml down
```
The system uses only ephemeral volumes, so you don't have to worry on looking for any volume to delete.

## For enabling only the DBs
For development or contribution, you will need to enable only partial of the services.
```shell
docker-compose up
```