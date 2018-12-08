var db = require('../fn/mysql-db');
var md5 = require('crypto-js/md5');

exports.add = userEntity => {
    var md5_pwd = md5(userEntity.Password);
	var sql = `INSERT INTO users(Username, Password, ID_Roles) values('${userEntity.Username}', '${md5_pwd}', 4)`;
	return db.write(sql);
}

exports.validateCredentials = userEntity => {
    var md5_pwd = md5(userEntity.Password);
    var sql = `SELECT * FROM users WHERE Username = '${userEntity.Username}' AND Password = '${md5_pwd}' AND Status = 2`;
    return db.load(sql);
}

exports.updateRefreshToken = (userEntity, rfToken) => {
    var sql = `UPDATE users SET RefreshToken = '${rfToken}' WHERE Username = '${userEntity.Username}' AND Password = '${userEntity.Password}' AND Status = 2`;
    return db.load(sql);
}

exports.changeStatus = (userEntity, status) => {
    var sql = `UPDATE users SET Status = ${status} WHERE Username = '${userEntity.Username}'`;
    return db.write(sql);
}

exports.checkRefreshToken = (userEntity, rfToken) => {
    var sql = `SELECT * FROM users WHERE Username = '${userEntity.Username}' AND Password = '${userEntity.Password}' AND RefreshToken = '${rfToken}'`;
    return db.load(sql);
}

exports.checkUsernameAvailability = (userEntity) => {
    var sql = `SELECT * FROM users WHERE Username = '${userEntity.Username}'`;
    return db.load(sql);
}