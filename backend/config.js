module.exports = {
    mysql: {
        host     : 'localhost',
        port     : '3306',
        user     : 'root',
        password : '',
        database : 'booking_cars'
    },
    accessTokenSecret : "SECRET-BOOKING-CARS-TOKEN",
    refreshTokenSecret: "SECRET-BOOKING-CARS-REFRESH-TOKEN",
    accessTokenLife: '30m',
    refreshTokenLife: '24h',
    n: 5
}