const express = require('express');
const ExpressError = require("./expressError")


const listRoutes = require('./listRoutes')

const app = express();

app.use(express.json());
app.use("/items", listRoutes)




// 404 handler
app.use(function (req, res, next) {
    const notFoundError = new ExpressError("Not Found", 404);
    return next(notFoundError)
  });
  
  // generic error handler
app.use(function(err, req, res, next) {
    // the default status is 500 Internal Server Error
    let status = err.status || 500;
    let message = err.message;
  
    // set the status and alert the user
    return res.status(status).json({
      error: {message, status}
    });
});

module.exports = app;