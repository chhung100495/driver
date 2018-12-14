module.exports = {
    mysql: {
        host     : 'localhost',
        port     : '3306',
        user     : 'root',
        password : '',
        database : 'booking_cars'
    },
    accessTokenSecret : "SECRET-BOOKING-CARS-TOKEN",
    refreshTokenSecret: "SECRET-DRIVER-SYSTEM-REFRESH-TOKEN",
    accessTokenLife: '24h',
    refreshTokenLife: 86400,
    n: 5
}
