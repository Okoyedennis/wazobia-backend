const express = require("express");
const {
  register,
  confirmationToken,
  resendLink,
  login,
  logout,
  myDetails,
} = require("../controllers/auth");
const { auth } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, myDetails)
router.get("/:id/verify/:token", confirmationToken);
router.post("/resend-link/:id", resendLink);
router.post("/logout", auth, logout);

module.exports = {
  authRoutes: router,
}; 
 