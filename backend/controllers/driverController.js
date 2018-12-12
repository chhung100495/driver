var express = require('express');
var driverRepo = require('../repositories/driverRepository');
var jwt = require('jsonwebtoken');

var config = require('../config');
var constants = require('../constants');
var middlewares = require('../fn/middlewares');

var router = express.Router();

let driverEntity,
    acToken,
    rfToken;

router.post('/register', (req, res, next) => {
    driverRepo.checkUsernameAvailability(req.body)
        .then(rows => {
            if (rows.length > 0) {
                throw new Error("Tên đăng nhập đã tồn tại.");
            } else {
                return driverRepo.add(req.body)
                    .then(value => {
                        console.log(value);
                        res.statusCode = 201;
                        res.json({
                            success: true,
                            msg: "Đăng ký thành công."
                        });
                    })
            }
        })
        .catch(err => {
            next(err)
        })
});

router.post('/login', (req, res, next) => {
    driverRepo.validateCredentials(req.body)
        .then(rows => {
            if (rows.length > 0) {
                driverEntity = rows[0];

                var payload = {
                    user: driverEntity
                }
                acToken = jwt.sign(payload, config.accessTokenSecret, {
                    expiresIn: config.accessTokenLife // seconds
                });

                rfToken = jwt.sign(payload, config.refreshTokenSecret, {
                    expiresIn: config.refreshTokenLife
                });

                // update refresh token in database
                return driverRepo.updateRefreshToken(driverEntity, rfToken)
            } else {
                throw new Error("Sai thông tin tên đăng nhập hoặc mật khẩu.");
            }
        })
        .then(value => {
            console.log(value);
            driverRepo.changeStatus(driverEntity, constants.status.online)
                .then(value => {
                    console.log(value);
                    res.json({
                        auth: true,
                        id: driverEntity.ID,
                        username: driverEntity.Username,
                        msg: "Đăng nhập thành công.",
                        access_token: acToken,
                        refresh_token: rfToken
                    })
                })
        })
        .catch(err => {
            next(err)
        })
});

router.post('/logout', middlewares.verifyAccessToken, (req, res, next) => {
    driverRepo.changeStatus(req.body, constants.status.offline)
        .then(value => {
            console.log(value);
            res.json({
                success: true,
                msg: "Đăng xuất thành công.",
            })
        })
        .catch(err => {
            next(err)
        })
});

router.post('/refresh', middlewares.verifyRefreshToken, (req, res) => {
    driverRepo.checkRefreshToken(req.payload.user, req.rfToken)
        .then(rows => {
            if (rows.length > 0) {
                var driverEntity = rows[0];

                var payload = {
                    user: driverEntity
                }
                var acToken = jwt.sign(payload, config.accessTokenSecret, {
                    expiresIn: config.accessTokenLife // seconds
                });

                res.json({
                    auth: true,
                    access_token: acToken
                })
            } else {
                res.json({
                    auth: false
                })
            }
        })
        .catch(err => {
            next(err)
        })
});

router.post('/changeStatus', middlewares.verifyAccessToken, (req, res, next) => {
    driverRepo.changeStatus(req.body, req.body.Status)
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

router.post('/updateCoordinates', middlewares.verifyAccessToken, (req, res, next) => {
    driverRepo.updateCoordinates(req.body, req.body.Latitude, req.body.Longtitude)
        .then(value => {
            console.log(value);
            res.json({
                success: true,
                msg: "Cập nhật vị trí thành công.",
            })
        })
        .catch(err => {
            next(err)
        })
});

router.get('/:id', middlewares.verifyAccessToken, (req, res) => {
    var id = req.params.id;
    driverRepo.loadSingle(id)
        .then(rows => {
            if (rows.length > 0) {
                res.json(rows[0]);
            } else {
                res.statusCode = 204;
                res.end('No data');
            }
        })
        .catch(err => {
            next(err);
        })
})

module.exports = router;
