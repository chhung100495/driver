var express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    cors = require('cors');

var userCtrl = require('./controllers/userController');

var middlewares = require('./fn/middlewares');

var app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/*' }));

app.get('/', middlewares.verifyAccessToken, (req, res) => {
    res.json({
        msg: 'Driver System'
    });
});

app.use('/users', userCtrl);

var port = process.env.port || 3000;
app.listen(port, () => {
    console.log(`api running on port ${port}`);
});