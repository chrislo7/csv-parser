# csv-parser

## Description
A command line application in Javascript that takes two arguments:
1. REQUIRED: Input File (path to CSV file)
2. OPTIONAL: Output File (path to a folder where the application will create a file)

This application reads the CSV and parses them.
Invalid data entries will be printed to command line, while valid entries will be stored in the database.

If an output path is specified, a new CSV file will be created with valid entries.

## Setup Instructions

### Initial Setup
1. Add desired users and passwords to `docker-compose.yml` under the environment block.
```
environment:
    MYSQL_ROOT_USER:
    MYSQL_ROOT_PASSWORD: 
    MYSQL_DATABASE: employeedb
    MYSQL_USER: 
    MYSQL_PASSWORD: 
```
2. Ensure you are in the project directory and  `cd app`
3. Run `npm install`

### Running the application

1. Run `docker-compose up`
2. Verify docker mysql and redis are both running properly with `docker ps` and
`docker exec -it %CONTAINER_ID%  /bin/sh; exit` (Replace `%CONTAINER_ID%` with Container ID in docker ps)
    - You should be able to log in to verify database contents with `mysql employeedb -u %MYSQL_USER% -p` and entering the password.
3. Run `npm start %INPUT_PATH% %OUTPUT_PATH%` OR `node executiion.js %INPUT_PATH% %OUTPUT_PATH%`
    - INPUT PATH: this is a required field, with CSV as file type.
    - OUTPUT PATH: this is an optional field, with CSV as file type.


### Exiting the application
1. Run ctrl-c / `docker-compose stop` to stop the containers
2. Run `docker-compose down` to remove the stopped containers.

### Restarting with a blank state.
1. After running ctrl-c, run `docker-compose down -v`
The volume flag, `-v` removes all volumes. Use this to do a full reset of environment.

## Code Design

### Database
I opted to use mysql as it is what I'm currently most familiar with.
For the database design itself, it contains a single table, `employee`, 
with the required columns:

```
+--------------+--------------+------+-----+-------------------+
| Field        | Type         | Null | Key | Default           |
+--------------+--------------+------+-----+-------------------+
| employee_id  | varchar(255) | YES  |     | NULL              |
| first_name   | varchar(255) | YES  |     | NULL              |
| last_name    | varchar(255) | YES  |     | NULL              |
| phone_number | varchar(255) | YES  |     | NULL              |
| email        | varchar(255) | YES  |     | NULL              |
| created_at   | timestamp    | NO   |     | CURRENT_TIMESTAMP |
| deleted_at   | timestamp    | YES  |     | NULL              |
+--------------+--------------+------+-----+-------------------+
```

## Referenced Materials

Getting started with Docker Compose: 
https://docs.docker.com/compose/gettingstarted/