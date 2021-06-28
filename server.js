// Dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");
require("console.table");
require('dotenv').config();
var figlet = require('figlet');
// Connection to MySQL database
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});
// Empty arrays to push data into
let departmentInfo = [];
let roleInfo = [];
let employeeInfo = [];
// ASCII art
figlet('Employee Tracker', function (err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data)
});
// Functions
const loadMenu = () => {
    loadDeptInfo();
    loadRoleInfo();
    loadEmployeeInfo();
    inquirer
        .prompt([
            {
                name: "menu",
                type: "list",
                message: "What would you like to do?",
                choices: [
                    "View all employees",
                    "View employees by department",
                    "Add employee",
                    "Update employee role",
                    "Delete employee",
                    "View roles",
                    "Add role",
                    "View departments",
                    "Add department",
                    "QUIT",
                ],
            },
        ])
        .then((answer) => {
            switch (answer.menu) {
                case "View all employees":
                    readEmployees();
                    break;
                case "View employees by department":
                    viewByDepartment();
                    break;
                case "Add employee":
                    addEmployee();
                    break;
                case "Update employee role":
                    updateEmployeeRole();
                    break;
                case "Delete employee":
                    deleteEmployee();
                    break;
                case "View roles":
                    readRoles();
                    break;
                case "Add role":
                    addRole();
                    break;
                case "View departments":
                    readDepartments();
                    break;
                case "Add department":
                    addDepartment();
                    break;
                case "QUIT":
                    quit();
                    break;
                default:
                    quit();
            }
        });
};
const loadDeptInfo = () => {
    departmentInfo = []
    connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        res.forEach(index => {
            departmentInfo.push({ name: index.name, value: index.id })
        });
    })
};
const loadRoleInfo = () => {
    roleInfo = []
    connection.query("SELECT * FROM role", (err, res) => {
        if (err) throw err;
        res.forEach(index => {
            roleInfo.push({ name: index.title, value: index.id });
        });
    })
};
const loadEmployeeInfo = () => {
    employeeInfo = []
    connection.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err;
        res.forEach(index => {
            employeeInfo.push(`${index.id} ${index.first_name} ${index.last_name}`)
        });
    })
};
const readEmployees = () => {
    let queryString = `
  SELECT employee.id, first_name, last_name, title, salary, name AS department_name
  FROM employee
  LEFT JOIN role
  ON role_id = role.id
  LEFT JOIN department
  ON department_id = department.id`
    connection.query(queryString, (err, res) => {
        if (err) throw err;
        console.table(res);
        loadMenu();
    });
};
const viewByDepartment = () => {
    inquirer
        .prompt([
            {
                name: "department",
                type: "list",
                choices: departmentInfo,
                message: 'Which department would you like to view?'
            }
        ])
        .then((answer) => {
            let queryString =
                'SELECT employee.id, employee.first_name, employee.last_name, department.name FROM employee JOIN role ON employee.role_id = role.id JOIN department ON department.id = role.department_id WHERE department.id = ?';
            connection.query(queryString, answer.department, (err, res) => {
                if (err) throw err;
                console.table(res);
                loadMenu();
            }
            );
        })
}
const addEmployee = () => {
    inquirer
        .prompt([
            {
                name: "firstName",
                type: "input",
                message: "Enter the employee\'s first name."
            },
            {
                name: "lastName",
                type: "input",
                message: "Enter the employee\'s last name."
            },
            {
                name: "role",
                type: "list",
                choices: roleInfo,
                message: "Select the employee\'s role."
            },
        ])
        .then((answer) => {
            connection.query(
                "INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)",
                [answer.firstName, answer.lastName, answer.role],
                (err, res) => {
                    if (err) throw err;
                    console.log(`${res.affectedRows} Done!\n`);
                }
            );
            readEmployees();
        });
};
const updateEmployeeRole = () => {
    inquirer
        .prompt([
            {
                name: "employee",
                type: "list",
                choices: employeeInfo,
                message: "Which employee would you like to update?",
            },
            {
                name: "role",
                type: "list",
                choices: roleInfo,
                message: "What is their new role?"
            }
        ])
        .then((answer) => {
            connection.query(`UPDATE FROM employee WHERE id = ${answer.employee.split(" ", 1)}`,
                (err, res) => {
                    if (err) throw err;
                    console.log(`${res.affectedRows} Done!\n`);
                }
            );
            readEmployees();
        });
};
const deleteEmployee = () => {
    inquirer
        .prompt([
            {
                name: "employee",
                type: "list",
                choices: employeeInfo,
                message: "Which employee would you like to delete?"
            }
        ])
        .then((answer) => {
            connection.query(`DELETE FROM employee WHERE id = ${answer.employee.split(" ", 1)}`,
                (err, res) => {
                    if (err) throw err;
                    console.log(`${res.affectedRows} Done!\n`);
                }
            );
            readEmployees();
        });
}
const readRoles = () => {
    connection.query("SELECT * FROM role", (err, res) => {
        if (err) throw err;
        console.table(res);
        loadMenu();
    });
};
const addRole = () => {
    inquirer
        .prompt([
            {
                name: "title",
                type: "input",
                message: "What is the title?",
            },
            {
                name: "salary",
                type: "input",
                message: "What is the salary?"
            },
            {
                name: "depId",
                type: "list",
                choices: departmentInfo,
                message: "What's the Department?",
            },
        ])
        .then((answer) => {
            connection.query(
                "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)",
                [answer.title, answer.salary, answer.depId],
                (err, res) => {
                    if (err) throw err;
                    console.log(`${res.affectedRows} Done!\n`);
                }
            );
            readRoles();
        });
};
const readDepartments = () => {
    connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        console.table(res);
        loadMenu();
    });
};
const addDepartment = () => {
    inquirer
        .prompt([
            {
                name: "department",
                type: "input",
                message: "What's the Department name?",
            },
        ])
        .then((answer) => {
            connection.query(
                "INSERT INTO department SET ?",
                {
                    name: answer.department,
                },
                (err, res) => {
                    if (err) throw err;
                    console.log(`${res.affectedRows} Done!\n`);
                }
            );
            readDepartments();
        });
};
const quit = () => {
    connection.end();
}
connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId} `);
    loadMenu();
});
  
