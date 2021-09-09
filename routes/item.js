const express = require("express");
const router = express.Router();
const multer = require("multer");
const os = require("os");

const { index, store, show } = require("../controller/admin/ItemController");

router.get("/", index);
router.post("/store", multer({ dest: os.tmpdir() }).array("imageId"), store);
router.get("/show-image/:id", show);

module.exports = router;
