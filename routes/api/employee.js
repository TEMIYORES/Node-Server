const express = require("express");
const path = require("path");
const employeeController = require("../../controller/employeeController");
const verifyRoles = require("../../middleware/verifyRoles");
const ROLES_LIST = require("../../config/roles_list");
const router = express.Router();
router
  .route("/")
  .get(employeeController.getAllEmployees)
  .post(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    employeeController.createNewEmployee
  )
  .put(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    employeeController.updateEmployee
  )
  .delete(verifyRoles(ROLES_LIST.Admin), employeeController.deleteEmployee);

router
  .route("/:id")
  .get(verifyRoles(ROLES_LIST.Admin), employeeController.getEmployee);
module.exports = router;
