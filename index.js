const inquirer = require("inquirer");
// const fs = require("fs");
// const Manager = require("./lib/Manager");
// const Engineer = require("./lib/Engineer");
// const Intern = require("./lib/Intern");
// const renderTeam = require("./src/html-templates")

// const teamMemeberObjArr = [];

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
        viewAllDepartments();
        break;
      case "View All Roles":
        createIntern();
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
  console.log('asdf')
}


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