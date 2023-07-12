require("dotenv").config();
const express = require("express");
const path = require("path");
const reqHandler = require("../middleware/reqHandler");
const errHandler = require("../middleware/errorHandler");
const cors = require("cors");
const jwtVerify = require("../middleware/verifyJwt");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const corsOptions = require("../config/corsOptions");
const connectDB = require("../config/mongoDBConn");
const app = express();

// Connect to MongoDB
connectDB();

// CUSTOM MIDDLEWARE
app.use(reqHandler);

// Handle options Credentials check - before CORS!
// and fetch cookies credentials requirement
// THIRD-PARTY MIDDLEWARE
app.use(cookieParser());

app.use(cors(corsOptions));

//  BUILT-IN MIDDLEWARE
// middleware to handle urlencoded data e.g form data:
// 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

app.use(express.json());

// middleware for cookies

// Serve static files
app.use("/", express.static(path.join(__dirname, "public")));

// Serve router Handlers
app.use("/", require("../routes/root"));
app.use("/register", require("../routes/register"));
app.use("/auth", require("../routes/auth"));
app.use("/refresh", require("../routes/refresh"));
app.use("/logout", require("../routes/logout"));

app.use(jwtVerify);
app.use("/employees", require("../routes/api/employee"));
app.use("/users", require("../routes/api/user"));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "404.html"));
});
app.all("*", (req, res) => {
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Page Not Found" });
  } else {
    res.type("txt").send("404 Page Not Found");
  }
});
PORT = process.env.PORT || 3400;

app.use(errHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log("Serve running on PORT : ", PORT);
  });
});

process.on("uncaughtException", (err) => {
  console.error(
    "An unexpected errror was caught : " + err.name + " : " + err.message
  );
});

module.exports.handler = serverless(app)