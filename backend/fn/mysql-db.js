var mysql = require('mysql');

var config = require('../config');

exports.load = function(sql) {
    return new Promise((resolve, reject) => {
        var connection = mysql.createConnection(config.mysql);

        connection.connect();

        connection.query(sql, function(error, results, fields) {
            if (error)
                reject(error);
            else
                resolve(results);

            connection.end();
        });
    });
}

exports.write = function(sql) {
    return new Promise((resolve, reject) => {
        var connection = mysql.createConnection(config.mysql);

        connection.connect();

        connection.query(sql, (error, value) => {
            if (error)
                reject(error);
            else
                resolve(value);

            connection.end();
        });
    });
}