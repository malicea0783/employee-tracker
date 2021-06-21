const mysql = require('mysql');
const PORT = process.env.PORT || 3001;

const readEmployees = () => {
  connection.query('SELECT * FROM employees_db', (err, res) => {
    if (err) throw err;
    console.log(res);
    connection.end();
  });
};

connection.connect((err) => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}`);
  afterConnection();
});