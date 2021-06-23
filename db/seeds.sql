USE employees_db;
INSERT INTO department(name)
VALUES
    ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal');

INSERT INTO role(title, salary, department_id)
VALUES
    ('Sales Lead', 100000.00, 1),
    ('Salesperson', 80000.00, 1),
    ('Lead Engineer', 150000.00, 2),
    ('Software Engineer', 120000.00, 2),
    ('Legal Team Lead', 250000.00, 4),
    ('Lawyer', 190000.00, 4),
    ('Finance Lead', 16000.00, 3),
    ('Accountant', 125000.00, 3);

INSERT INTO employee(first_name, last_name, role_id)
VALUES
    ('Valerie', 'Michalecki', 2),
    ('Fiona', 'Apple', 4),
    ('Yves', 'Tumor', 7),
    ('King', 'Princess', 8);