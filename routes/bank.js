const express = require("express");
const router = express.Router();

const multer = require("multer");
const os = require("os");

const {
  index,
  store,
  destroy,
  update,
} = require("../controller/admin/BankController");

router.get("/", index);
router.post(
  "/store",
  multer({
    dest: os.tmpdir(),
  }).single("imageUrl"),
  store
);
router.put(
  "/update",
  multer({
    dest: os.tmpdir(),
  }).single("imageUrl"),
  update
);
router.delete("/destroy/:id", destroy);

module.exports = router;
