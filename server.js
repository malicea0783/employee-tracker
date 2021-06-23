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

// Dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");
require("console.table");
require('dotenv').config();

// Connection to MySQL database
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

let departmentInfo = []

const loadMenu = () => {
  loadDeptInfo()
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
          "Remove employee",
          "Update employee role",
          "View roles",
          "Add role",
          "Remove role",
          "View departments",
          "Add department",
          "Remove department",
          "QUIT",
        ],
      },
    ])
    .then((answer) => {
      if (answer.menu === "View all employees") {
        readEmployees();
      }
      if (answer.menu === "View roles") {
        readRoles();
      }
      if (answer.menu === "Add role") {
        addRole();
      }
      if (answer.menu === "View departments") {
        readDepartments();
      }
      if (answer.menu === "Add department") {
        addDepartment();
      }
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
      {
        name: "departmentId",
        type: "number",
        message: "What's the Department ID?",
      },
    ])
    .then((answer) => {
      console.log(answer);
      connection.query(
        "INSERT INTO department SET ?",
        {
          name: answer.department,
          id: answer.departmentId,
        },
        (err, res) => {
          if (err) throw err;
          console.log(`${res.affectedRows} Done!\n`);
        }
      );
      readDepartments();
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
      console.log(departmentInfo.indexOf(answer.depId) + 1);
      connection.query(
        "INSERT INTO role (title, salary, department_id) VALUES(?, ?, ?)",
        [answer.title, answer.salary, departmentInfo.indexOf(answer.depId) + 1],
        (err, res) => {
          if (err) throw err;
          console.log(`${res.affectedRows} Done!\n`);
        }
      );
      readDepartments();
    });
};

const readEmployees = () => {
  let queryString = `
  SELECT first_name, last_name, title, salary, name AS department_name
  FROM employee
  LEFT JOIN role
  ON role_id = role.id
  LEFT JOIN department
  ON department_id = department.id`
  connection.query(queryString, (err, res) => {
    if (err) throw err;
    console.table(res);
    connection.end();
  });
};

const readRoles = () => {
  connection.query("SELECT * FROM role", (err, res) => {
    if (err) throw err;
    // console.log(res)
    console.table(res);
  });
};

const readDepartments = () => {
  connection.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;
    console.table(res);
  });
};

const loadDeptInfo = () => {
  departmentInfo = []
  connection.query("SELECT * FROM department", (err,res) => {
    if(err) throw err;
    res.forEach(index => {
      departmentInfo.push(index.name)
    });
  })
}
// view employees by department
// inquirer asks what department
// select * from employee left join role on employee.role_id = role.id left join department on role.department_id = department.id where department = answer.department
connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
  loadMenu();
});
