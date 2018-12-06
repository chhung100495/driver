var express = require('express');
var requestRepo = require('../repositories/requestRepository');
var broadcastAll = require('../webSocket').broadcastAll;

var router = express.Router();

router.post('/', (req, res, next) => {
  var id = req.body.ID
  requestRepo.getRequestByID(id).then(value => {
    res.statusCode = 200
    if (value.length > 0) {
      res.json(value[0])
      broadcastAll(value[0])
    } else {
      res.json({})
    }
  }).catch(err => {
    next(err)
  })
})


module.exports = router;