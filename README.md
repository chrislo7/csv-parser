# csv-parser

## Description
A command line application in Javascript that reads input from a .CSV file and saves the data to a MySQL database via Docker.

1. REQUIRED parameter: Input File (path to CSV file)
2. OPTIONAL parameter: Output File (path to where the application will create a file)

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
3. Create an `.env` file here and add the following:
    - MYSQL_USER and MYSQL_PASSWORD will be the credentials you've created above with the same headings.
```
# port
PORT=3306

MYSQL_USER=
MYSQL_PASSWORD=
MYSQL_DATABASE=employeedb
```
4. Ensure you are in the `/app` directory and run `npm install` 

### Running the application

1. Run `docker-compose up`
2. Verify docker mysql and redis are both running properly with `docker ps` and
`docker exec -it %CONTAINER_ID%  /bin/sh; exit` (Replace `%CONTAINER_ID%` with Container ID in docker ps)
    - You should be able to log in to verify database contents with `mysql employeedb -u %MYSQL_USER% -p` and entering the password.
3. Run `cd app` in a separate terminal tab/window.
4. Run `node executiion.js %INPUT_PATH% %OUTPUT_PATH%`
    - INPUT PATH: this is a required field, with CSV as file type.
    - OUTPUT PATH: this is an optional field, with CSV as file type.
    - Feel free to use the created `/input` and `/output` folders to read/write input and output files.

### Exiting the application
1. Run ctrl-c / `docker-compose stop` to stop the containers.
2. Run `docker-compose down` to remove the stopped containers.

### Restarting with a blank state.
1. After running ctrl-c, run `docker-compose down -v`
    - The volume flag, `-v` removes all volumes. Use this to do a full reset of environment.

### Testing
1. Run `cd app` while in the project's root directory.
2. Run `npm run test` to run automated testing.

## Code Design
### Node.js Design
As this is a basic command line application, I simply created Javascript files that separates the functions from the main execution file for easier readability and modularity.

Reading and writing files simply uses node file system module.
I've added a couple of libraries to make things a bit easier - 'csv-parse', 'mysql', 'moment' and 'dotenv'.

I've also created an `Employee` class. While technically not necessary for this project, in a real world application, a class with appropriate methods would be essential and much more scalable.

As I have some basic knowledge of regex, I opted to use regex to keep consistency as the phone/email regex and added it for employee id.

### Test Design
I tried to follow a TDD approach when writing most of the functions. This helped me think of corner-cases and ensure my code would have less issues overall.

### Database Design
I opted to use mysql as it is what I'm currently most familiar with.
For the database design itself, it simply contains a single table, `employee` with the required columns.

```
+--------------+--------------+------+-----+---------------------+-----------------------------+
| Field        | Type         | Null | Key | Default             | Extra                       |
+--------------+--------------+------+-----+---------------------+-----------------------------+
| employee_id  | varchar(255) | NO   | PRI | NULL                |                             |
| first_name   | varchar(255) | YES  |     | NULL                |                             |
| last_name    | varchar(255) | YES  |     | NULL                |                             |
| phone_number | varchar(255) | YES  |     | NULL                |                             |
| email        | varchar(255) | YES  |     | NULL                |                             |
| created_at   | timestamp    | NO   |     | 0000-00-00 00:00:00 |                             |
| updated_at   | timestamp    | NO   |     | CURRENT_TIMESTAMP   | on update CURRENT_TIMESTAMP |
| deleted_at   | timestamp    | YES  |     | NULL                |                             |
+--------------+--------------+------+-----+---------------------+-----------------------------+
```
- PRIMARY KEY is the `employee_id`.
- created_at, updated_at and deleted_at are timestamp fields that would automatically generate based on the csv data.
    - note that deleted_at is not currently being used as deleting an entry is currently not supported.
- created_at will only update when the employee is first inserted into this table.
- updated_at will only update when the employee is first inserted into this table as well as when it is updated

## Referenced Materials

Getting started with Docker Compose: 
https://docs.docker.com/compose/gettingstarted/

How to create MySQL instance with Docker Compose
https://medium.com/@chrischuck35/how-to-create-a-mysql-instance-with-docker-compose-1598f3cc1bee

Invalid default value for timestamp
https://stackoverflow.com/questions/36747096/invalid-default-value-for-timestamp

Checking for duplicate keys on update in SQL
https://stackoverflow.com/questions/2714587/mysql-on-duplicate-key-update-for-multiple-rows-insert-in-single-query