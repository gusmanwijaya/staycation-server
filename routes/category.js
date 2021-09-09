const express = require("express");
const router = express.Router();

const {
  index,
  store,
  update,
  destroy,
} = require("../controller/admin/CategoryController");

router.get("/", index);
router.post("/store", store);
router.put("/update", update);
router.delete("/destroy/:id", destroy);

module.exports = router;
