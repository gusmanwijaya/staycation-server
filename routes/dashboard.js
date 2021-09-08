const express = require("express");
const router = express.Router();

const { index } = require("../controller/admin/DashboardController");

router.get("/", index);

module.exports = router;
