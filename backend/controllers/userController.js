var express = require('express');
var userRepo = require('../repositories/userRepository');
var jwt = require('jsonwebtoken');

var config = require('../config');
var middlewares = require('../fn/middlewares');

var router = express.Router();

router.post('/register', (req, res) => {
    userRepo.checkUsernameAvailability(req.body)
        .then(rows => {
            if (rows.length > 0) {
                res.json({
                    success: false,
                    msg: "Username already exists"
                })

                return {
                    "availability": false
                }
            } else {
                return {
                    "availability": true
                }
            }
        })
        .then(info => {
            if(info.availability === true) {
                return userRepo.add(req.body)
                    .then(value => {
                        console.log(value);
                        res.statusCode = 201;
                        res.json({
                            success: true,
                            msg: "Registration successful"
                        });
                    })
            }
        })
        .catch(err => {
            next(err)
        })
});

router.post('/login', (req, res, next) => {
    userRepo.login(req.body)
        .then(rows => {
            if (rows.length > 0) {
                var userEntity = rows[0];

                var payload = {
                    user: userEntity
                }
                var acToken = jwt.sign(payload, config.accessTokenSecret, {
                    expiresIn: config.accessTokenLife // seconds
                });

                var rfToken = jwt.sign(payload, config.refreshTokenSecret, {
                    expiresIn: config.refreshTokenLife
                });

                return {
                    "auth": true,
                    "userEntity": userEntity,
                    "acToken": acToken,
                    "rfToken": rfToken
                }
            } else {
                res.json({
                    auth: false
                })

                return {
                    "auth": false
                }
            }
        })
        .then(info => {
            if(info.auth === true) {
                // store refresh token into database
                return userRepo.addNewRefreshToken(info.userEntity, info.rfToken)
                    .then(value => {
                        console.log(value);
                        res.json({
                            auth: true,
                            access_token: info.acToken,
                            refresh_token: info.rfToken
                        })
                    })
            }
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

module.exports = router;
