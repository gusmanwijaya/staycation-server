const express = require("express");
const router = express.Router();

const { index } = require("../controller/admin/BankController");

router.get("/", index);

module.exports = router;
