const connection = require("./config/connection")
const inquirer = require("inquirer");
const { error } = require("console");
// import { viewAllDepartments } from './js/server'

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
        createIntern();
        break;
      case "Add Department":
        createIntern();
        break;
      case "Add Role":
        createIntern();
        break;
      case "Add Employee":
        createIntern();
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
    console.log(results, 'www')
    if(err) throw err;
    
    mainMenu();
  })
}
const viewAllRoles = () => {
  db.query("SELECT * FROM role;", function(err, results){
    console.log(results, 'qqq')
    if(error) console.log(error)
  })
};


// const buildTeam = () => {
//   fs.writeFile("./dist/index.html", renderTeam(teamMemeberObjArr), (err) =>
//   err ? console.log(err) : console.log('Success!')
// );

// }

// initialize function
const init = () => {
  mainMenu();
};

init();