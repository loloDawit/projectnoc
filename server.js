//Main Entry Point
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
// Load ENV Variables
dotenv.config({ path: './config/config.env' });
// Middleware
const errorHandler = require('./middleware/error');
// Router files
const stores = require('./routes/stores');
const projects = require('./routes/projects');
const auth = require('./routes/authenticate');

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
// File upload for photos
app.use(fileupload());

// Use static file and folders
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
app.use('/api/v1/stores', stores);
app.use('/api/v1/projects', projects);
app.use('/api/v1/auth', auth);

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
