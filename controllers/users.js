const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Conflict, Unauthorized } = require("http-errors");
const path = require("path");
const fs = require("fs/promises");
const gravatar = require("gravatar");

const { resizeAvatar } = require("../service/resizeAvatar");
const { User } = require("../models/userModel");
const { UserSchema } = require("../routes/middlewares/userJoi");

const registerUser = async (req, res, next) => {
  const { email, password } = req.body;

  const { error } = UserSchema.validate(req.body, {
    context: { requestMethod: req.method },
  });

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const savedUser = await User.create({
      email,
      password: hashedPassword,
      avatarURL: gravatar.url(email, { d: "identicon" }),
    });

    res.status(201).json({
      user: {
        email,
        id: savedUser._id,
        subscription: savedUser.subscription,
      },
    });
  } catch (error) {
    if (error.message.includes("E11000 duplicate key error")) {
      throw new Conflict("Email in use(409)");
    }
    throw error;
  }
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  const { error } = UserSchema.validate(req.body, {
    context: { requestMethod: req.method },
  });

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const storedUser = await User.findOne({
    email,
  });

  if (!storedUser) {
    throw new Unauthorized("Email or password is wrong(401)");
  }

  const isPasswordValid = await bcrypt.compare(password, storedUser.password);
  if (!isPasswordValid) {
    throw new Unauthorized("Email or password is wrong(401)");
  }

  const payload = { id: storedUser.id };
  const token = jwt.sign(payload, process.env.JWT_SECRET);

  await User.findByIdAndUpdate(storedUser._id, { token });

  return res.status(200).json({
    token: token,
    user: {
      email,
      subscription: storedUser.subscription,
    },
  });
};

const logoutUser = async (req, res) => {
  const storedUser = req.user;

  await User.findByIdAndUpdate(storedUser._id, { token: null });
  req.headers.authorization = "";

  return res.status(204).end();
};

const currentUser = async (req, res, next) => {
  const user = req.user;
  console.log(user);

  return res.status(200).json({
    user: {
      email: user.email,
      subscription: user.subscription,
      id: user._id,
    },
  });
};

const updateAvatar = async (req, res) => {
  const { path: tmpPath, originalname } = req.file;
  const { id } = req.user;
  const newImageName = `${id}_${originalname}`;
  const newPath = path.join("public", "avatars", newImageName);

  await resizeAvatar(tmpPath);

  try {
    await fs.rename(tmpPath, newPath);
    await User.findByIdAndUpdate(id, { avatarURL: newPath });
    res.status(200).json({
      avatarURL: newPath,
    });
  } catch (error) {
    await fs.unlink(tmpPath);
    throw Error(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
  updateAvatar,
};
