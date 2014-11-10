var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'chenhao',
    password : 'chenhao'
});

connection.connect();

connection.query('SELECT host FROM mysql.user', function(err, rows, fields) {
    if (err) throw err;

    console.log('The solution is: ', rows,fields);
});

connection.end();