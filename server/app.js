const express = require('express')
    , http = require('http')
    , bodyParser = require('body-parser')
    // , session = require('express-session')
    , config = require('./config');

const app = express();

app.use(require('morgan')('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



app.use(express.static('dist'))


// app.use(session({
//     // store: new redisStore({
//     //     "host": "127.0.0.1",
//     //     "port": "6379",
//     //     "ttl": config.session_age,
//     // }),
//     secret: config.session_secret,
//     // cookie: { maxAge: config.session_age }, 
//     resave: true,
//     saveUninitialized: true
// }));

app.use('/', require('./routes/index'))
app.use('/api', require('./routes/api'))
app.use('/auth', require('./routes/auth'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.json( {
            message: err.message,
            error: err
        });
    });
}

// production error handler
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    console.log(err)
});

http.createServer(app)
    .listen(process.env.PORT || 3000)
    .on('listening', function () {
        console.log('listening ' + this.address().port)
    })
