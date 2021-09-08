const express = require("express");
const router = express.Router();

const { index } = require("../controller/admin/CategoryController");

router.get("/", index);

module.exports = router;
