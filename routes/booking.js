const express = require("express");
const router = express.Router();

const { index } = require("../controller/admin/BookingController");

router.get("/", index);

module.exports = router;
