const express = require("express");

const { tryCatchWrapper } = require("../../service/catchWrapper");
const { auth } = require("../middlewares/verify");

const {
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
  updateAvatar,
  verifyEmail,
  repeatVerifyEmail,
} = require("../../controllers/users");
const { upload } = require("../middlewares/upload");

const router = express.Router();

router.post("/register", tryCatchWrapper(registerUser));
router.post("/login", tryCatchWrapper(loginUser));
router.post("/logout", auth, tryCatchWrapper(logoutUser));
router.get("/current", auth, tryCatchWrapper(currentUser));
router.patch(
  "/avatars",
  auth,
  upload.single("avatar"),
  tryCatchWrapper(updateAvatar)
);
router.get("/verify/:verificationToken", tryCatchWrapper(verifyEmail));
router.post("/verify", tryCatchWrapper(repeatVerifyEmail));

module.exports = router;
