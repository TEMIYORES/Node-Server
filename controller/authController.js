const UserDB = require("../model/User");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) {
    return res
      .status(400)
      .json({ error: "Username and Password are required" }); // bad request
  }

  const foundUser = await UserDB.findOne({ username: user }).exec();
  if (!foundUser) return res.sendStatus(401); //unauthorized
  try {
    // decrypt password
    const unHashedPwd = await bcrypt.compare(pwd, foundUser.password);
    if (unHashedPwd) {
      const roles = Object.values(foundUser.roles);
      // create JWT
      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: foundUser.username,
            roles: roles,
          },
        },

        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "2m" }
      );
      const refreshToken = jwt.sign(
        { username: foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      // Saving refreshToken with  current User
      let result = await UserDB.findOneAndUpdate(
        { username: foundUser.username },
        { refreshToken },
        { new: true }
      );
      // OR foundUser.refreshToken = refreshToken
      // let result = foundUser.save();

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "None",
      }); //secure: true,
      res.json({ accessToken });
    } else {
      return res.sendStatus(401);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = handleLogin;
