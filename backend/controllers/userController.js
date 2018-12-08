var express = require('express');
var userRepo = require('../repositories/userRepository');
var jwt = require('jsonwebtoken');

var config = require('../config');
var constants = require('../constants');
var middlewares = require('../fn/middlewares');

var router = express.Router();

let userEntity,
    acToken,
    rfToken;

router.post('/register', (req, res, next) => {
    userRepo.checkUsernameAvailability(req.body)
        .then(rows => {
            if (rows.length > 0) {
                throw new Error("Tên đăng nhập đã tồn tại.");
            } else {
                return userRepo.add(req.body)
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
    userRepo.validateCredentials(req.body)
        .then(rows => {
            if (rows.length > 0) {
                userEntity = rows[0];

                var payload = {
                    user: userEntity
                }
                acToken = jwt.sign(payload, config.accessTokenSecret, {
                    expiresIn: config.accessTokenLife // seconds
                });

                rfToken = jwt.sign(payload, config.refreshTokenSecret, {
                    expiresIn: config.refreshTokenLife
                });

                // update refresh token in database
                return userRepo.updateRefreshToken(userEntity, rfToken)
            } else {
                throw new Error("Sai thông tin tên đăng nhập hoặc mật khẩu.");
            }
        })
        .then(value => {
            console.log(value);
            userRepo.changeStatus(userEntity, constants.status.online)
                .then(value => {
                    console.log(value);
                    res.json({
                        auth: true,
                        username: userEntity.Username,
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
    userRepo.changeStatus(req.body, constants.status.offline)
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
    userRepo.checkRefreshToken(req.payload.user, req.rfToken)
        .then(rows => {
            if (rows.length > 0) {
                var userEntity = rows[0];

                var payload = {
                    user: userEntity
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
    userRepo.changeStatus(req.body, req.body.Status)
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

module.exports = router;
