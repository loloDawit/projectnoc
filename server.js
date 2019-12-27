//Main Entry Point
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
// Router files
const stores = require('./routes/stores');

// Load ENV Variables
dotenv.config({ path: './config/config.env' });

const app = express();

// Development envi logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/v1/stores', stores);
const PORT = process.env.PORT;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
