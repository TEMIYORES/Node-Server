const express = require("express");
const {
  deleteUser,
  getAllUsers,
  updateUser,
  createNewUser,
} = require("../../controller/userController");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");
const router = express.Router();
router
  .route("/")
  .get(verifyRoles(ROLES_LIST.Admin), getAllUsers)
  .put(verifyRoles(ROLES_LIST.Admin), updateUser)
  .post(verifyRoles(ROLES_LIST.Admin), createNewUser)
  .delete(verifyRoles(ROLES_LIST.Admin), deleteUser);

module.exports = router;
