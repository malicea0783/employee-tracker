DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;
USE employees_db;
CREATE TABLE department (
    id INT not NULL PRIMARY KEY,
    name VARCHAR(30) not NULL
);
CREATE TABLE role (
    id INT not NULL PRIMARY KEY,
    title VARCHAR(30) not NULL,
    salary DECIMAL(10, 2) not NULL,
    department_id INT not NULL,
    FOREIGN KEY (department_id) REFERENCES department(id)
);
CREATE TABLE employee (
    id INT AUTO_INCREMENT not NULL PRIMARY KEY,
    first_name VARCHAR(30) not NULL,
    last_name VARCHAR(30) not NULL,
    role_id INT not NULL,
    FOREIGN KEY (role_id) REFERENCES role(id)
);


