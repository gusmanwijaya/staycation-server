const express = require("express");
const {
  landingPage,
  detailPage,
  bookingPage,
} = require("../controller/api/apiController");
const router = express.Router();

const multer = require("multer");
const os = require("os");

router.get("/landing-page", landingPage);
router.get("/detail-page/:id", detailPage);
router.post(
  "/booking-page",
  multer({ dest: os.tmpdir() }).single("image"),
  bookingPage
);

module.exports = router;
