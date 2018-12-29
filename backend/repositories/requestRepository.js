var db = require('../fn/mysql-db');
var moment = require('moment');

exports.getRequestByID = function (id) {
  var sql = `SELECT req.*, sts.Name as StatusName FROM requests req JOIN status sts ON req.Status = sts.ID
            WHERE req.ID = ${id}`
  return db.load(sql)
}

exports.changeStatus = (id, status) => {
  var sql = `UPDATE requests SET Status = ${status}, created_at = ${moment().unix()} WHERE ID = ${id}`;
  return db.write(sql);
}

exports.updateRequest = (id, status, driverId) => {
  var sql = `UPDATE requests SET Status = ${status}, Driver = ${driverId}, created_at = ${moment().unix()} WHERE ID = ${id}`;
  return db.write(sql);
}