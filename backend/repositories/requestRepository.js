var db = require('../fn/mysql-db');

exports.getRequestByID = function (id) {
  var sql = `select req.*, sts.Name as StatusName from REQUESTS req join STATUS sts on req.Status = sts.ID
            where req.ID = ${id}`
  return db.load(sql)
}
