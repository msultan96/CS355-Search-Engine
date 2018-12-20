// PACKAGES
// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
var express = require('express');
var app = express();
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var createError = require('http-errors');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
var Search = require('./models/Search');
var crawler = require('./helpers/crawler');
var cheerio = require('cheerio');
var fs = require('fs');

// PATHS + VIEW ENGINE SETUP
// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'models')));
app.use(express.static(path.join(__dirname, 'helpers')));
app.use(express.static(path.join(__dirname, 'public/javascripts/')));
app.use(express.static(path.join(__dirname, 'public/stylesheets/')));
app.use(express.static(path.join(__dirname, 'public/stylesheets/')));
app.set('models', path.join(__dirname, 'models'));
app.set('helpers', path.join(__dirname, 'helpers'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// bodyParser CONFIGURE
// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.post("/api/search", function(req, res) {
    var search = req.body.query;
    res.writeHead(301,{Location:'/api/search/'+search});
    res.end();
});

// idk tbh
// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));

// MONGOOSE SETUP
// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
mongoose.connect("mongodb://hammad:test123@ds029824.mlab.com:29824/355-search-engine", { useNewUrlParser: true });
// mongoose.connect("mongodb://localhost:27017/355-search-engine", {useNewUrlParser: true});
mongoose.connection.once('open', () => {
    console.log("connected to database");
});


// ROUTES
// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
var indexRouter = require('./routes/index');
var searchRouter = require('./routes/search');
var adminRouter = require('./routes/admin');
var apiRouter = require('./routes/api');

// ROUTE REGISTRATION
// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
app.use('/', indexRouter);
app.use('/search', searchRouter);
app.use('/admin', adminRouter);
app.use('/api', apiRouter);


module.exports = app;


// ERROR HANDLING
// = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =

//catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

//error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { title: 'CS355 Search ' + err.status });
});

app.listen(3001, () => {
  console.log('listening to port 3000');
});
