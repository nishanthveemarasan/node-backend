const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'mysql',
    user: 'app_user',
    password: 'password',
    database: 'app_db',
    port: 3306
});

module.exports = pool.promise();