const UserDB = require("../model/User");
const bcrypt = require("bcrypt");
const getAllUsers = async (req, res) => {
  const users = await UserDB.find();
  res.json(users);
};
const createNewUser = async (req, res) => {
  if (!req?.body.username || !req.body.password)
    return res.status(404).json({ error: "Username and password required!" });
  const duplicate = await UserDB.findOne({
    username: req.body.username,
  }).exec();
  if (duplicate) return res.sendStatus(409);
  try {
    // hashpwd
    const hashedPwd = await bcrypt.hash(req.body.password, 10);
    const new_user = await UserDB.create({
      username: req.body.username,
      password: hashedPwd,
    });
    res.json(new_user);
  } catch (err) {
    res.json({ error: err.message });
  }
};
const updateUser = async (req, res) => {
  if (!req?.body?.id)
    return res.status(404).json({ error: "User Id required!" });
  const user = await UserDB.findOne({ _id: req.body.id });
  if (!user)
    return res
      .status(204)
      .json({ error: `User with id ${req.body.id} Not Found` });
  try {
    if (req.body?.username) user.username = req.body.username;
    if (req.body?.password) {
      const hashedPwd = await bcrypt.hash(req.body.password, 10);
      user.password = hashedPwd;
    }
    const updated_user = await user.save();
    res.json(updated_user);
  } catch (err) {
    res.json({ error: err.message });
  }
};
const deleteUser = async (req, res) => {
  if (!req?.body?.id)
    return res.status(404).json({ error: "User Id required!" });

  const deleted_user = await UserDB.deleteOne({ _id: req.body.id });
  res.json(deleted_user);
};

module.exports = { getAllUsers, createNewUser, updateUser, deleteUser };
