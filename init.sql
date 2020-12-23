USE employeedb

CREATE TABLE employee (
    employee_id varchar(255),
    first_name varchar(255),
    last_name varchar(255),
    phone_number varchar(255),
    email varchar(255),
    created_at timestamp DEFAULT NOW(),
    updated_at timestamp DEFAULT NOW(),
    deleted_at timestamp NULL DEFAULT NULL
);