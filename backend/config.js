module.exports = {
    mysql: {
        host     : 'localhost',
        port     : '3306',
        user     : 'root',
        password : '',
        database : 'booking_cars'
    },
    accessTokenSecret : "driver-system-access-token",
    refreshTokenSecret: "driver-system-refresh-token",
    accessTokenLife: 300,
    refreshTokenLife: 86400
}