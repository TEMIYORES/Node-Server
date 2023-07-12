const logEvents = require("./logEvents");

const errHandler = (err, req, res, next) => {
  logEvents(`${err.message}\t${req.url}`, "errLogs.txt");
  res.statusCode = 500;
  next();
};
module.exports = errHandler;
