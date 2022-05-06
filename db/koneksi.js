
var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'YOUR_HOST_MYSQL',
  user: 'YOUR_USERNAME_MYSQL',
  password: 'YOUR_PASSWORD_MYSQL',
  database: 'YOUR_DATABASE_MYSQL'
});

connection.connect();

module.exports = {mysql,connection}

