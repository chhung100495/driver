var express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    cors = require('cors');

var driverCtrl = require('./controllers/driverController');
var requestCtrl = require('./controllers/requestController');

var middlewares = require('./fn/middlewares');

var app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/*' }));

app.use('/drivers', driverCtrl);
app.use('/requests', middlewares.verifyAccessToken, requestCtrl);

app.get('/', (req, res) => {
  res.json({
      msg: 'Driver System'
  });
});

app.use((req, res, next) => {
  var err = new Error("Not found");
  err.status = 404;
  next(err);
})

app.use((err, req, res, next) => {
  console.log(err)
  res.status(err.status || 500);
  res.json({
    'error': err.message
  });
})

var port = process.env.port || 3003;
app.listen(port, () => {
    console.log(`api running on port ${port}`);
});
