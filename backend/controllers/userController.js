var express = require('express');
var userRepo = require('../repositories/userRepository');
var jwt = require('jsonwebtoken');

var config = require('../config');
var middlewares = require('../fn/middlewares');

var router = express.Router();

router.post('/register', (req, res) => {
    userRepo.add(req.body)
        .then(value => {
            console.log(value);
            res.statusCode = 201;
            res.json(req.body);
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end('View error log on server console');
        })
});

router.post('/login', (req, res) => {
    userRepo.login(req.body)
        .then(rows => {
            if (rows.length > 0) {
                var userEntity = rows[0];

                var payload = {
                    user: userEntity
                }
                var acToken = jwt.sign(payload, config.accessTokenSecret, {
                    expiresIn: '24h' // seconds
                });

                var rfToken = jwt.sign(payload, config.refreshTokenSecret, {
                    expiresIn: config.refreshTokenLife
                });

                return {
                    "userEntity": userEntity,
                    "acToken": acToken,
                    "rfToken": rfToken
                }
            } else {
                res.json({
                    auth: false
                })
            }
        })
        .then(info => {
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
        })
        .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end('View error log on server console');
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
            console.log(err);
            res.statusCode = 500;
            res.end('View error log on server console');
        })
});

module.exports = router;
