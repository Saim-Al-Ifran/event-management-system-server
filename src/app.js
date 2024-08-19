const express = require('express');
const app = express();
const helmet= require('helmet');
const xssClean = require('xss-clean');
const cors =require('cors');
const { nodeEnv } = require('./secret');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const router = require('./routes/index');

// Middlewares //
app.use(cookieParser());
app.use(express.json());
app.use(helmet());
if(nodeEnv !== 'production'){
       const morgan = require('morgan');
       app.use(morgan('dev'));
}
app.use(xssClean());
app.use(cors());
app.use(compression());
app.use(router);

// Default middleware for handling errors
app.use((err, _req, res, _next) => {
  const message = err.message || 'Server Error Occurred';
  const status = err.status || 500;  // Ensure status is set, default to 500
  res.status(status).json({
    message,
    status,
  });
});


module.exports = app;