var jwt = require('jsonwebtoken');

var config = require('../config');

var middlewares = {
    verifyAccessToken: (req, res, next) => {
        var token = req.headers['x-access-token'];
        if (token) {
            jwt.verify(token, config.accessTokenSecret, (err, payload) => {
                if (err) {
                    res.statusCode = 403;
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
            res.statusCode = 403;
            res.json({
                msg: 'No token found'
            });
        }
    },
    verifyRefreshToken: (req, res, next) => {
        var token = req.headers['x-refresh-token'];
        if (token) {
            jwt.verify(token, config.refreshTokenSecret, (err, payload) => {
                if (err) {
                    res.statusCode = 403;
                    res.json({
                        msg: 'Invalid token',
                        error: err
                    });
                } else {
                    req.payload = payload;
                    req.rfToken = token;
                    next();
                }
            })
        } else {
            res.statusCode = 403;
            res.json({
                msg: 'No token found'
            });
        }
    }
}

module.exports = middlewares;