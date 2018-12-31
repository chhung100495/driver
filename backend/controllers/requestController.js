var express = require('express');
var requestRepo = require('../repositories/requestRepository');
var webSocket = require('../webSocket');
var config = require('../config');
var constants = require('../constants');
var haversineDistance = require('../fn/haversineDistance').calculate;

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

  // change status to 'online' to able receive another request
  webSocket.changeStatus(request.driver, constants.status.online);

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
    requestRepo.changeStatus(request.ID, constants.status.noCar)
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

router.post('/changeStatus', (req, res, next) => {
  var id = req.body.ID;
  requestRepo.changeStatus(id, constants.status.received)
      .then(value => {
          console.log(value);
          res.json({
              success: true,
              msg: "Thay đổi trạng thái thành công.",
          })
      })
      .catch(err => {
          next(err)
      })
});

router.post('/accepted', (req, res, next) => {
  var id = req.body.ID;
  var driverId = req.body.driver;
  requestRepo.updateRequest(id, constants.status.received, driverId)
      .then(value => {
          console.log(value);
          res.json({
              success: true,
              msg: "Cập nhật request thành công.",
          })
      })
      .catch(err => {
          next(err)
      })
});

router.post('/completed', (req, res, next) => {
  var id = req.body.ID;
  var driver = req.body.driver;

  // change status to 'online' to able receive another request
  webSocket.changeStatus(driver, constants.status.online);

  // update status of request to "Completed"
  requestRepo.changeStatus(id, constants.status.completed)
    .then(value => {
      console.log(value);
      res.json({
        msg: "Chuyến đi đã hoàn thành."
      })
  }).catch(err => {
    next(err);
  })
})

router.get('/processingRequest', (req, res, next) => {
  var id = req.query.id;
  var driverId = req.query.driverId;
  requestRepo.getProcessingRequest(id, driverId, constants.status.received)
      .then(rows => {
        if (rows.length > 0) {
          rows[0].distance = Number(haversineDistance(rows[0].Latitude, rows[0].Longtitude, rows[0].FinishLatitude, rows[0].FinishLongtitude).toFixed(2));
          res.json(rows[0]);
        } else {
          throw new Error("Không tìm thấy request.");
        }
      })
      .catch(err => {
          next(err)
      })
});

module.exports = router;
