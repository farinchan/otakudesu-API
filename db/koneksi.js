
var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'master',
  database: 'otakudesu_api'
});

connection.connect();

module.exports = {mysql,connection}

