const express = require("express");
const handleLogin = require("../controller/authController");
const router = express.Router();
router.route("/").post(handleLogin);

module.exports = router;
