const { signup, login, logout, changePassword } = require("../Controllers/AuthController"); // Import logout
const { signupValidation, loginValidation } = require("../Middlewares/AuthValidation");

const router = require("express").Router();

router.post("/login", loginValidation, login);
router.post("/signup", signupValidation, signup);
router.post("/change-password", changePassword);
router.post("/logout", logout);  // Add logout route

module.exports = router;
