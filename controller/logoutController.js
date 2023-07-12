const UserDB = require("../model/User");
const jwt = require("jsonwebtoken");

const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) res.sendStatus(204); //no content
  const refreshToken = cookies.jwt;

  //   is refreshToken in DB?
  const foundUser = await UserDB.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    return res.sendStatus(204);
  }

  try {
    //   Delete refresh Token in DB
    let result = await UserDB.findOneAndUpdate(
      { refreshToken },
      { refreshToken: "" },
      { new: true }
    );
    // OR let result = await foundUser.save()

    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    return res.sendStatus(204);
  } catch (err) {
    res.send({ error: err.message });
  }
};

module.exports = handleLogout;
