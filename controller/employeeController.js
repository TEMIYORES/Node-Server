const EmployeeDB = require("../model/Employee");

const getAllEmployees = async (req, res) => {
  const employees = await EmployeeDB.find();
  if (!employees) return res.status(204).json({ error: "No Employees Found" });
  res.status(200).json(employees);
};
const createNewEmployee = async (req, res) => {
  if (!req?.body?.firstname || !req?.body?.lastname) {
    res.status(400).json({ error: "No firstname or lastname" }); //bad request
  }
  try {
    const new_emp = await EmployeeDB.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });
    res.status(201).json(new_emp); // created sucessfully
  } catch (err) {
    res.json({ error: err.message });
  }
};

const updateEmployee = async (req, res) => {
  if (!req?.body?.id)
    return res
      .status(400)
      .json({ error_Message: "Employee ID parameter required!" });
  const employee = await EmployeeDB.findOne({ _id: req.body.id }).exec();
  if (!employee)
    return res
      .status(204)
      .json({ error: `Employee with Employee Id "${req.body.id}" not found` }); //No content

  try {
    // const result = await EmployeeDB.updateOne(
    //   { _id: req.body.id },
    //   { firstname: req.body.firstname, lastname: req.body.lastname },

    // );

    if (req.body?.firstname) employee.firstname = req.body.firstname;
    if (req.body?.lastname) employee.lastname = req.body.lastname;

    let result = await employee.save();
    res.json(result);
  } catch (err) {
    res.json({ error: err.message });
  }
};

const deleteEmployee = async (req, res) => {
  if (!req?.body?.id)
    return res
      .status(400)
      .json({ error_Message: "Employee ID parameter required!" });

  const employee = await EmployeeDB.findOne({ _id: req.body.id }).exec();
  if (!employee)
    return res
      .status(204)
      .json({ error: `Employee with Employee Id "${req.body.id}" not found` }); //No content

  let result = await employee.deleteOne();
  
  res.json(result);
};

const getEmployee = async (req, res) => {
  if (!req?.params?.id)
    return res
      .status(400)
      .json({ error_Message: "Employee ID parameter is required!" });
  const employee = await EmployeeDB.findOne({
    _id: req.params.id,
  }).exec();
  if (!employee) {
    res.status(204).json({
      error: `Employee with Employee Id "${req.params.id}" not found`,
    }); //No content
  }

  res.json(employee);
};

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};
