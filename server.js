// Dependencies
const mysql = require('mysql');
const inquirer = require('inquirer');
require('console.table');
// Connection to MySQL database
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'employees_db',
});
// loadprompts (inquirer choices)
// selecting a choice will go to that function
// view all employees
// view employees by department
// view employees by manager
// add employee
// remove emplyee
// update employee role
// update employee manager
// view roles
// add role
// remove role
// view departments
// add department
// remove department
// quit
const loadMenu = () => {
    inquirer
        .prompt([
            {
                name: 'menu',
                type: 'list',
                message: 'What would you like to do?',
                choices: [
                    'View all employees',
                    'View employees by department',
                    'Add employee',
                    'Remove employee',
                    'Update employee role',
                    'View roles',
                    'Add role',
                    'Remove role',
                    'View departments',
                    'Add department',
                    'Remove department',
                    'QUIT']
            }
        ])
        .then((answer) => {
            // if answer = view x then run x function
            if (answer.menu === 'View all employees') {
                readEmployees();
            }
            if (answer.menu === 'View roles') {
                readRoles();
            }
            if (answer.menu === 'View departments') {
                readDepartments();
            }
        })
}
// const createDepartment = () => {
//     inquirer
//         .prompt([
//             {
//                 name: 'department',
//                 type: 'input',
//                 message: 'What\'s the Department name?',
//             },
//             {
//                 name: 'departmentId',
//                 type: 'number',
//                 message: 'What\'s the Department ID?',
//             },
//         ])
//         .then((answer) => {
//             console.log(answer);
//             connection.query(
//                 'INSERT INTO department SET ?',
//                 {
//                     name: answer.department,
//                     id: answer.departmentId,
//                 },
//                 (err, res) => {
//                     if (err) throw err;
//                     console.log(`${res.affectedRows} Done!\n`);
//                 }
//             );
//             readDepartment();
//         })
// };
const readEmployees = () => {
    connection.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        console.table(res);
        connection.end();
    });
};
const readRoles = () => {
    connection.query('SELECT * FROM role', (err, res) => {
        if (err) throw err;
        console.table(res);
    });
};
const readDepartments = () => {
    connection.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        console.table(res);
    });
};
// view employees by department
// inquirer asks what department
// select * from employee left join role on employee.role_id = role.id left join department on role.department_id = department.id where department = answer.department
connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
    loadMenu();
});