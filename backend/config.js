module.exports = {
    mysql: {
        host     : 'localhost',
        port     : '3306',
        user     : 'root',
        password : 'root',
        database : 'booking_cars'
    },
    accessTokenSecret : "SECRET-BOOKING-CARS-TOKEN",
    refreshTokenSecret: "driver-system-refresh-token",
    accessTokenLife: 300,
    refreshTokenLife: 86400
}
