const express = require('express');
const app = express();
const helmet= require('helmet');
const xssClean = require('xss-clean');
const cors =require('cors');
const { nodeEnv } = require('./secret');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const router = require('./routes/index');
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const swaggerDoc = YAML.load(path.join(__dirname, './docs/swagger.yaml'));

// Middlewares //
app.use(cookieParser());
app.use(express.json());
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));
app.use(helmet());
if(nodeEnv !== 'production'){
       const morgan = require('morgan');
       app.use(morgan('dev'));
}
app.use(xssClean());
app.use(cors());
app.use(compression());
app.use(router);


app.get('/', (_req, res) => {
  res.status(200).json({message:'welcome, server is running'});
});


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