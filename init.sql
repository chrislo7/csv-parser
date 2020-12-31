SET sql_mode = '';

USE employeedb
CREATE TABLE employee (
    employee_id varchar(255) NOT NULL UNIQUE,
    first_name varchar(255),
    last_name varchar(255),
    phone_number varchar(255),
    email varchar(255),
    created_at TIMESTAMP DEFAULT '0000-00-00 00:00:00', 
    updated_at TIMESTAMP DEFAULT now() ON UPDATE now(),
    deleted_at timestamp NULL DEFAULT NULL,
    PRIMARY KEY (employee_id)
);