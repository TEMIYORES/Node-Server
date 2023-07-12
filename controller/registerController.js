const UserDB = require("../model/User");
const bcrypt = require("bcrypt");

const AddNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) {
    return res
      .status(400)
      .json({ error: "Username and Password are required" }); // bad request
  }

  // Check duplicate
  const duplicate = await UserDB.findOne({ username: user }).exec();
  if (duplicate) {
    return res.status(409).json({ message: `User ${user} already exists` }); //conflict
  }
  try {
    // Hash password
    const hashPwd = await bcrypt.hash(pwd, 10);
    // Store the new user
    const result = await UserDB.create({
      username: user,
      password: hashPwd,
    });

    res.status(201).json({ Message: "New user was created successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message }); //server error
  }
};

module.exports = { AddNewUser };
