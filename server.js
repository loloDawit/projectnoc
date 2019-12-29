//Main Entry Point
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
// Load ENV Variables
dotenv.config({ path: './config/config.env' });
// Middleware
const errorHandler = require('./middleware/error');
// Router files
const stores = require('./routes/stores');
const projects = require('./routes/projects');
const connectDB = require('./config/db');

// Connect to database
connectDB();

const app = express();
// Body parser
app.use(express.json());

// Development envi logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/v1/stores', stores);
app.use('/api/v1/projects', projects);

const PORT = process.env.PORT;

app.use(errorHandler);

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Handle all promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red.bold);
  // close server and exit process
  server.close(() => {
    process.exit(1);
  });
});
