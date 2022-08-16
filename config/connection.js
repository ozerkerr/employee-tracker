const mysql = require('mysql2');

// Connect to database
const connection = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL Username
    user: 'root',
    // Add MySQL Password
    password: 'password123',
    database: 'employee_db'
  },
  console.log(`Connected to the employee_db database.`)
);

module.exports = connection;