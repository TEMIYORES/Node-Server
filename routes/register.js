const express = require("express");
const { AddNewUser } = require("../controller/registerController");
const router = express.Router();
router.route("/").post(AddNewUser);

module.exports = router;
