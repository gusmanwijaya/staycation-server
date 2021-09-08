const express = require("express");
const router = express.Router();

const { index } = require("../controller/admin/ItemController");

router.get("/", index);

module.exports = router;
