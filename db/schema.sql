drop database if exists employees_db;

create database employees_db;

use employees_db;

create table department(
    id int not null primary key,
    name varchar(30) not null
);

create table role(
    id int not null primary key,
    title varchar(30) not null,
    salary decimal(10, 2) not null,
    department_id int not null, 
    foreign key (department_id) references department(id) 
);

create table employee(
    id int auto_increment not null primary key,
    first_name varchar(30) not null,
    last_name varchar(30) not null,
    role_id int not null,
    foreign key (role_id) references role(id),
    manager_id int,
    foreign key (manager_id) references employee(id)
);  



