INSERT INTO department (id, name)
VALUES (1, "Engineering"),
       (2, "Finance"),
       (3, "Legal"),
       (4, "Sales");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 100000, 4),
       ("Salesperson", 80000, 4),
       ("Lead Engineer", 150000, 1),
       ("Software Engineer", 120000, 1),
       ("Account Manager", 160000, 2),
       ("Accountant", 125000, 2),
       ("Legal Team Lead", 250000, 3),
       ("Lawyer", 190000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe" 1, 4, null)
       ("Mike", "Chan" 2, 4, 1)
       ("Ashley", "Rodrigez" 3, 4, null)
       ("Kevin", "Tupik" 4, 4, 3)
       ("Kunal", "Singh" 5, 4, null)
       ("Malia", "Brown" 6, 4, 5)
       ("Sarah", "Lourd" 7, 4, null)
       ("Tom", "Allen" 8, 4, 7)