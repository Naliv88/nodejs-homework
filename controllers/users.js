const { User } = require("../models/userModel");
const { UserSchema } = require("../routes/middlewares/userJoi");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Conflict, Unauthorized } = require("http-errors");

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

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
};
