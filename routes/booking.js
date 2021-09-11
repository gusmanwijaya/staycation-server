const express = require("express");
const router = express.Router();

const {
  index,
  show,
  actionConfirmation,
  actionReject,
} = require("../controller/admin/BookingController");

router.get("/", index);
router.get("/:id", show);
router.put("/:id/confirmation", actionConfirmation);
router.put("/:id/reject", actionReject);

module.exports = router;
