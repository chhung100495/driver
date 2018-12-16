var jwt = require('jsonwebtoken');

var config = require('../config');

var middlewares = {
    verifyAccessToken: (req, res, next) => {
        var token = req.headers['x-access-token'];
        if (token) {
            jwt.verify(token, config.accessTokenSecret, (err, payload) => {
                if (err) {
                    res.statusCode = 401;
                    res.json({
                        msg: 'Invalid token',
                        error: err
                    });
                } else {
                    req.payload = payload;
                    next();
                }
            })
        } else {
            res.statusCode = 401;
            res.json({
                msg: 'No token found'
            });
        }
    },
    verifyRefreshToken: (req, res, next) => {
        var rfToken = req.headers['x-refresh-token'];
        if (rfToken) {
            jwt.verify(rfToken, config.refreshTokenSecret, (err, payload) => {
                if (err) {
                    res.statusCode = 401;
                    res.json({
                        msg: 'Invalid refresh token',
                        error: err
                    });
                } else {
                    req.payload = payload;
                    req.rfToken = rfToken;
                    next();
                }
            })
        } else {
            res.statusCode = 401;
            res.json({
                msg: 'No refresh token found'
            });
        }
    }
}

module.exports = middlewares;