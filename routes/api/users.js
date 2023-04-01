const express = require("express");

const { tryCatchWrapper } = require("../../service/catchWrapper");
const { auth } = require("../middlewares/verify");

const {
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
} = require("../../controllers/users");

// /register
// /login
// / logout
// /current

const router = express.Router();

// Create a new users

router.post("/register", tryCatchWrapper(registerUser));
router.post("/login", tryCatchWrapper(loginUser));
router.post("/logout", tryCatchWrapper(auth), tryCatchWrapper(logoutUser));
router.get("/current", tryCatchWrapper(auth), tryCatchWrapper(currentUser));

module.exports = router;
