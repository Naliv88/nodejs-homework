const express = require("express");

const { tryCatchWrapper } = require("../../service/catchWrapper");
const { auth } = require("../middlewares/verify");

const {
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
  updateAvatar,
} = require("../../controllers/users");
const { upload } = require("../middlewares/upload");
// const { updateAvatar } = require("../../service/updateAvatar");

// /register
// /login
// / logout
// /current

const router = express.Router();

// Create a new users

router.post("/register", tryCatchWrapper(registerUser));
router.post("/login", tryCatchWrapper(loginUser));
router.post("/logout", auth, tryCatchWrapper(logoutUser));
router.get("/current", auth, tryCatchWrapper(currentUser));
// router.patch("/change", auth, tryCatchWrapper(userCtrl.change));
router.patch(
  "/avatars",
  auth,
  upload.single("avatar"),
  tryCatchWrapper(updateAvatar)
);

module.exports = router;
