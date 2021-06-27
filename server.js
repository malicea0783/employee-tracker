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

let departmentInfo = [];
let roleInfo = [];
let employeeInfo = [];

const loadMenu = () => {
  
  loadRoleInfo();
  loadDeptInfo();
  loadEmployeeInfo();

  inquirer
    .prompt([
      {
        name: "menu",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View all employees",
          "View all employees by dept",
          "Add new employee",
          "Update employee role",
          "View roles",
          "Add role",
          "View departments",
          "Add department",
          "QUIT",
        ],
      },
    ])
    .then((answer) => {
      if (answer.menu === "View all employees") {
        readEmployees();
      }
      if (answer.menu === "View all employees by dept") {
        viewByDepartment();
      }
      if (answer.menu === "Add new employee") {
        addEmployees();
      }
      if (answer.menu === "Update employee role") {
        updateEmployeeRole();
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
      if (answer.menu === "QUIT") {
        quit();
      }
    });
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
  });
  loadMenu();
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
          console.log(answer);
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

const addEmployees = () => {
  inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "What's the employees first name?",
      },
      {
        name: "lastName",
        type: "input",
        message: "What's the employees last name?",
      },
      {
        name: "role",
        type: "list",
        choices: roleInfo,
        message: "What's the employees role?",
      },

    ])
    .then((answer) => {
      
        console.log(roleInfo.indexOf(answer.role));
        connection.query(
          "INSERT INTO employee (first_name, last_name, role_id) VALUES(?, ?, ?)",
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
          connection.query(
              'UPDATE employee SET role_id = answer.role WHERE employee.role_id = answer.role_id',
              (err, res) => {
                  if (err) throw err;
                  console.log(`${res.affectedRows} Done!\n`);
              }
          );
          readEmployees();
          
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
      console.log(answer);
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
      readDepartments();
    });
};

const readRoles = () => {
  connection.query("SELECT * FROM role", (err, res) => {
    if (err) throw err;
    // console.log(res)
    console.table(res);
  });
  loadMenu();
};

const readDepartments = () => {
  connection.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;
    console.table(res);
  });
  loadMenu();
};

const loadDeptInfo = () => {
  departmentInfo = []
  connection.query("SELECT * FROM department", (err,res) => {
    if(err) throw err;
    res.forEach(index => {
      departmentInfo.push({name: index.name, value: index.id})
    });
  })
};

const loadRoleInfo = () => {
  roleInfo = []
  connection.query("SELECT * FROM role", (err,res) => {
    if(err) throw err;
    res.forEach(index => {
      roleInfo.push({name: index.title, value: index.id})
    });
  })
};

const loadEmployeeInfo = () => {
  employeeInfo = []
  connection.query("SELECT * FROM employee", (err, res) => {
      if (err) throw err;
      res.forEach(index => {
          employeeInfo.push({name: index.first_name, value: index.role})
        
      });
  })
};

const quit = () => {
    connection.end();
}

connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
  loadMenu();
});
