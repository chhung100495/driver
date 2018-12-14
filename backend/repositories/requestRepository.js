var db = require('../fn/mysql-db');

exports.getRequestByID = function (id) {
  var sql = `SELECT req.*, sts.Name as StatusName FROM requests req JOIN status sts ON req.Status = sts.ID
            WHERE req.ID = ${id}`
  return db.load(sql)
}

exports.changeStatus = (id, status) => {
  var sql = `UPDATE requests SET Status = ${status} WHERE ID = ${id}`;
  return db.write(sql);
}