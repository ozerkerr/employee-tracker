const connection = require("./config/connection")
const inquirer = require("inquirer");
const cTable = require('console.table');

// create a function to get manager class
const mainMenu = () => {
  inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices: ["View All Departments", "View All Roles", "View All Employees", "Add Department", "Add Role", "Add Employee", "Update Employee Role",]
    }
  ])
  .then(answers => {
    switch (answers.choice){
      case "View All Departments":
        // viewAllDepartments();
        viewAllDepartments();
        break;
      case "View All Roles":
        viewAllRoles();
        break;
      case "View All Employees":
        viewAllEmployees();
        break;
      case "Add Department":
        createIntern();
        break;
      case "Add Role":
        createIntern();
        break;
      case "Add Employee":
        addEmployee();
        break;
      default:
        buildTeam();
        break;
    }
    console.log(answers)
  })
};

const viewAllDepartments = () => {
  connection.query("SELECT * FROM department;", function(err, results){
    if(err) throw err;

    console.table(results);
    
    mainMenu();
  })
}
const viewAllRoles = () => {
  connection.query(`SELECT role.id, role.title, department.name AS department, role.salary
    FROM role INNER JOIN department ON role.department_id = department.id;`, function(err, results){

    if(err) console.log(err)

    console.table(results);

    mainMenu();
  })
};

const viewAllEmployees = () => {
  connection.query(`
    SELECT employee.id, employee.first_name, employee.last_name, role.title, 
    department.name AS 'department', 
    role.salary
    FROM employee, role, department 
    WHERE department.id = role.department_id 
    AND role.id = employee.role_id
    ORDER BY employee.id ASC`, function(err, results){
      if(err) console.log(err)

      console.table(results)

      mainMenu();
    })
}

const addEmployee = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'firstName',
      message: "What is the employee's first name?",
    },
    {
      type: 'input',
      name: 'lastName',
      message: "What is the employee's last name?",
    }
  ]).then(answer => {
    const newEmployee = [answer.firstName, answer.lastName];
    const getRole = `SELECT role.id, role.title FROM role`;
    connection.query(getRole, (err, data) => {
      if(err) console.log(err)
      const listOfRoles = data.map(({ id, title }) => ({ name: title, value: id }));
      inquirer.prompt([
        {
          type: 'list',
          name: 'role',
          message: "What is the employee's role?",
          choices: listOfRoles
        }
      ]).then(chosenRole => {
        newEmployee.push(chosenRole.role);
        connection.query('SELECT * FROM employee WHERE manager_id is NULL;', (err, data) => {
          if(err) console.log(err)
          const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
          inquirer.prompt([
            {
              type: 'list',
              name: 'manager',
              message: "Who is the employee's manager?",
              choices: managers
            }
          ]).then(chosenManager => {
            newEmployee.push(chosenManager.manager)
            connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
            VALUES (?, ?, ?, ?)`, newEmployee, (err) => {
              if(err) console.log(err)
              console.log("Employee has been added!")
              viewAllEmployees();
            })
          })
        })
      })
    })
  })
}

// initialize function
const init = () => {
  mainMenu();
};

init();