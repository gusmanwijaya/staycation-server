const express = require("express");
const { landingPage, detailPage } = require("../controller/api/apiController");
const router = express.Router();

router.get("/landing-page", landingPage);
router.get("/detail-page/:id", detailPage);

module.exports = router;
