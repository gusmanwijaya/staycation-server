const express = require("express");
const { landingPage } = require("../controller/api/apiController");
const router = express.Router();

router.get("/landing-page", landingPage);

module.exports = router;
