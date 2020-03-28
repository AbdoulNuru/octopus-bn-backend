import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import methodOverride from 'method-override';
import morgan from 'morgan';
import errorhandler from 'errorhandler';
import i18n from 'i18n-2';
import session from 'express-session';
import path from 'path';
import router from './routes/index';
import rateLimit from 'express-rate-limit';
import { socketio } from './utils/socket';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

// Create global app object
const app = express();

//Request Rate limit
if(process.env.NODE_ENV !== 'test'){  
// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
app.set('trust proxy', 1);
 
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message:
    "Too many requests from this IP, please try again after an hour"
});
 
//  apply to all requests
app.use(limiter);

}

// serve static files
app.use('/static', express.static(path.join(__dirname, '../public')));

app.use(morgan('dev'));

app.use(methodOverride());

// initialize passport
app.use(passport.initialize());

i18n.expressBind(app, {
  locales: ['en', 'fr']
});

app.use(cors());
app.use(require('morgan')('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

if (!isProduction) {
  app.use(errorhandler());
}

app.use((req, res, next) => {
  req.i18n.setLocaleFromQuery(req);
  req.i18n.setLocaleFromCookie();
  next();
});

app.use(router);

app.use(
  session({
    secret: 'authorshaven',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
  })
);

// / catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error(req.i18n.__('NotFound'));
  err.status = 404;
  next(err);
});

// / error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
        error: err
      }
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: {}
    }
  });
});

// finally, let's start our server...
const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port ${server.address().port}`);
});

const io = require('socket.io').listen(server);

socketio(io);

export default app;
