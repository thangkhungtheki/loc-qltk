require('dotenv').config()
const cors = require('cors');

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session')
//var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var app = express();
var indexRouter = require('./routes/user.route');

const routerLogin = require('./routes/login.router')

const routercheckip = require('./routes/checkip.router')

// path database
mongoose.connect(process.env.DATABASE_URL,{useNewUrlParser:true, useUnifiedTopology: true ,},);
// mongoose.set('strictQuery', false)

// const mongooseOptions = {
//   // ...
//   useUnifiedTopology: true,
//   useNewUrlParser:true
//   // ...
// };

// mongoose.connect(process.env.DATABASE_URL, mongooseOptions);


require('./config/passport'); //vượt qua passport để config trang đăng nhâp/đăng ký

app.use(cors())


app.use(session({
  secret: 'thangkhungtheki',
  resave: false,
  saveUninitialized: false,
}))
app.use(flash());
app.use(passport.initialize())
app.use(passport.session());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.use('/api/login/', routerLogin)

app.use('/ip',routercheckip )

// Middleware để lấy địa chỉ IP và user-agent

app.use((req, res, next) => {
	res.status(404).redirect("/signin");
});




module.exports = app;