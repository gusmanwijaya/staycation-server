const express = require("express");
const router = express.Router();
const {
  login,
  storeLogin,
  logout,
} = require("../controller/admin/UserController");
const { isLogin } = require("../middlewares/auth");

router.get("/", login);
router.post("/storeLogin", storeLogin);
router.get("/logout", isLogin, logout);

module.exports = router;
