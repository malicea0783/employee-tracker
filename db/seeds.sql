USE employees_db;
INSERT INTO department(id, name)
VALUES
    (10, 'Sales'),
    (20, 'Engineering'),
    (30, 'Finance'),
    (40, 'Legal');
USE employees_db;
INSERT INTO role(id, title, salary, department_id)
VALUES
    (100, 'Sales Lead', 100000.00, 10),
    (200, 'Salesperson', 80000.00, 10),
    (300, 'Lead Engineer', 150000.00, 20),
    (400, 'Software Engineer', 120000.00, 20),
    (500, 'Legal Team Lead', 250000.00, 40),
    (600, 'Lawyer', 190000.00, 40),
    (700, 'Finance Lead', 16000.00, 30),
    (800, 'Accountant', 125000.00, 30);
USE employees_db;
INSERT INTO employee(first_name, last_name, role_id)
VALUES
    ('Valerie', 'Michalecki', 200),
    ('Fiona', 'Apple', 400),
    ('Yves', 'Tumor', 700),
    ('King', 'Princess', 800);