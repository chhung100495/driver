var express = require('express');
var requestRepo = require('../repositories/requestRepository');
var webSocket = require('../webSocket');
var config = require('../config');
var constant = require('../constants');

var router = express.Router();

router.post('/', (req, res, next) => {
  var id = req.body.ID;
  requestRepo.getRequestByID(id)
    .then(rows => {
      res.statusCode = 200;
      if (rows.length > 0) {
        // init number of times send request
        rows[0].n = 0;
        // init list id of drivers had rejected request
        rows[0].ids = [];
        if (!webSocket.hasAnyDriverActivation(rows[0])) {
          res.json({
            msg: "Hiện không có tài xế để phục vụ."
          })
        }
        else {
          res.json(rows[0]);
          webSocket.sendToNearestClient(rows[0]);
        }
      } else {
        throw new Error("Gửi thông tin request thất bại.");
      }
    }).catch(err => {
      next(err);
    })
})

router.post('/resend', (req, res, next) => {
  var request = req.body;
  // 'n' is the number of resends
  if (request.n < config.n) {
    if (webSocket.hasAnyDriverActivation(request)) {
      webSocket.sendToNearestClient(request);
    }
    res.json({
      msg: "Server đã nhận được request."
    })
  } else {
    // if exceeded the number of resends, change status of request to "No car"
    requestRepo.changeStatus(request.ID, constant.status.noCar)
      .then(value => {
        console.log(value);
        res.json({
          msg: "Server đã nhận được request."
        })
    }).catch(err => {
      next(err);
    })
  }
})

module.exports = router;
