const jwt = require("jsonwebtoken");
const { User } = require("../../models/userModel");

async function auth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer") {
    return res.status(401).json("Not authorized");
    // throw HttpError(401, "token type is nod valid.");
  }

  if (!token) {
    return res.status(401).json("Not authorized");
  }

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    console.log(id);
    const user = await User.findById(id);

    if (!user) {
      return res.status(401).json("Not authorized");
    }
    req.user = user;
    next();
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      return res.status(401).json("Not authorized");
    }
  }
}

module.exports = {
  auth,
};
