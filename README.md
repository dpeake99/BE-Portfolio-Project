This project is an API that can be used to access data about various news articles, including the articles, topics, comments and users. The hosted version of the app can be found here: https://be-portfolio-project.herokuapp.com

The project can be cloned from github by using the command "git clone https://github.com/dpeake99/BE-Portfolio-Project.git" in the command terminal to clone the the project in to the desired repository
.
The required dependencies for the project can be install using the code npm install. This will install all of the dependencies that can be found in the package.json.  

To seed the local databases, run the command npm run seed. 

In order to be able to run this project, two environment files will need creating, '.env.test' and '.env.development'. These files should contain 'PGDATABASE=<database_name_here>', the database names for each file can be found in '/db/setup.sql'.

Finally, the unit tests used to ensure that the functionality of the project is as desired, can be run using the command npm test. 

The minimum version of Node.js required to run the project is 8.12.1

The minimum version of Postgres required to run the project is 8.7.3