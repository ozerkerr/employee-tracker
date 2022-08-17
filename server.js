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
        addDepartment();
        break;
      case "Add Role":
        addRole();
        break;
      case "Add Employee":
        addEmployee();
        break;
      default:
        updateEmployeeRole();
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

const addDepartment = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'department',
      message: "What is the name of department?",
    }
  ]).then(answer => {
    console.log(answer)
    connection.query("INSERT INTO department (name) VALUES (?)", answer.department, (err, result) => {
      if(err) console.log(err);
      console.log(`Added ${answer.department} to the database`);
      viewAllDepartments();
    })
  })
};

const addRole = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'newRole',
      message: "What is the name of the role?",
    },
    {
      type: 'input',
      name: 'salary',
      message: "What is the salary of the role?",
    }
  ]).then(answer => {
    const newRole = [answer.newRole, answer.salary]

    const getDepartments = "SELECT * FROM department";
    connection.query(getDepartments, (err, data) => {
      const listOfDepartments = data.map(({ id, name }) => ({ name: name, value: id }));

      inquirer.prompt([
        {
          type: 'list',
          name: 'departmentName',
          message: "Which depatment does the role belong to?",
          choices: listOfDepartments
        }
      ]).then(chosenDepartment => {
        newRole.push(chosenDepartment.departmentName)

        console.log(newRole)

        connection.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", newRole, (err) => {
          if(err) console.log(err)
          console.log(`Added ${newRole[0]} to the database`);
          viewAllRoles();
        })
      })
    })
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
              if(err) console.log(err);
              console.log(`Added ${newEmployee[0]} ${newEmployee[1]} to the database`);
              viewAllEmployees();
            })
          })
        })
      })
    })
  })
}

const updateEmployeeRole = () => {
  connection.query(`SELECT employee.id, employee.first_name, employee.last_name, role.id AS "role_id"
    FROM employee, role, department WHERE department.id = role.department_id AND role.id = employee.role_id`, (err, res) => {
    if (err) console.log(error);
    let employeeNamesArray = [];
    res.forEach((employee) => {employeeNamesArray.push(`${employee.first_name} ${employee.last_name}`);});

    connection.query(`SELECT role.id, role.title FROM role`, (error, result) => {
      if (err) console.log(error);
      let rolesArray = [];
      result.forEach((role) => {rolesArray.push(role.title);});

      inquirer
        .prompt([
          {
            name: 'chosenEmployee',
            type: 'list',
            message: 'Which employee has a new role?',
            choices: employeeNamesArray
          },
          {
            name: 'chosenRole',
            type: 'list',
            message: 'What is their new role?',
            choices: rolesArray
          }
        ])
        .then((answer) => {
          let newTitleId, employeeId;

          result.forEach((role) => {
            if (answer.chosenRole === role.title) {
              newTitleId = role.id;
              console.log(newTitleId, 'newTitleId')
            }
          });

          console.log(result, 'ffff')

          res.forEach((employee) => {
            if (
              answer.chosenEmployee ===
              `${employee.first_name} ${employee.last_name}`
            ) {
              employeeId = employee.id;
              console.log(employeeId, 'employeeId')
            }
          });

          connection.query(
            `UPDATE employee SET employee.role_id = ? WHERE employee.id = ?`,
            [newTitleId, employeeId],
            (error) => {
              if (error) throw error;
              console.log(`Employee Role Updated`);
              viewAllEmployees();
            }
          );
        });
    });
  });
};

// initialize function
const init = () => {
  mainMenu();
};

init();