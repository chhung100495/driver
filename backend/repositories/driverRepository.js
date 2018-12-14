var db = require('../fn/mysql-db');
var md5 = require('crypto-js/md5');
var moment = require('moment');

exports.add = driverEntity => {
    var md5_pwd = md5(driverEntity.Password);
	var sql = `INSERT INTO drivers(Username, Password, created_at, updated_at) values('${driverEntity.Username}', '${md5_pwd}', ${moment().unix()}, ${moment().unix()})`;
	return db.write(sql);
}

exports.validateCredentials = driverEntity => {
    var md5_pwd = md5(driverEntity.Password);
    var sql = `SELECT * FROM drivers WHERE Username = '${driverEntity.Username}' AND Password = '${md5_pwd}'`;
    return db.load(sql);
}

exports.updateRefreshToken = (driverEntity, rfToken) => {
    var sql = `UPDATE drivers SET RefreshToken = '${rfToken}', updated_at = ${moment().unix()} WHERE ID = ${driverEntity.ID} AND Status = 2`;
    return db.load(sql);
}

exports.changeStatus = (driverEntity, status) => {
    var sql = `UPDATE drivers SET Status = ${status}, updated_at = ${moment().unix()} WHERE ID = ${driverEntity.ID}`;
    return db.write(sql);
}

exports.checkStatus = (driverEntity, status) => {
    var sql = `SELECT * FROM drivers WHERE ID = ${driverEntity.ID} AND Status = ${status}`;
    return db.load(sql);
}

exports.checkRefreshToken = (driverEntity, rfToken) => {
    var sql = `SELECT * FROM drivers WHERE Username = '${driverEntity.Username}' AND Password = '${driverEntity.Password}' AND RefreshToken = '${rfToken}'`;
    return db.load(sql);
}

exports.checkUsernameAvailability = (driverEntity) => {
    var sql = `SELECT * FROM drivers WHERE Username = '${driverEntity.Username}'`;
    return db.load(sql);
}

exports.updateCoordinates = (driverEntity, lat, lng) => {
    var sql = `UPDATE drivers SET Latitude = '${lat}', Longtitude = '${lng}', updated_at = ${moment().unix()} WHERE ID = ${driverEntity.ID}`;
    return db.write(sql);
}

exports.loadSingle = (id) => {
    var sql = `SELECT Username, Latitude, Longtitude, Status FROM drivers WHERE ID = ${id}`;
    return db.load(sql);
}