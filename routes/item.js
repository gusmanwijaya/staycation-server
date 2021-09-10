const express = require("express");
const router = express.Router();
const multer = require("multer");
const os = require("os");

const {
  index,
  store,
  show,
  edit,
  update,
  destroy,
  showDetailItem,
  storeFeature,
  updateFeature,
  destroyFeature,
  storeActivity,
  updateActivity,
  destroyActivity,
} = require("../controller/admin/ItemController");

router.get("/", index);
router.post("/store", multer({ dest: os.tmpdir() }).array("imageId"), store);
router.get("/show-image/:id", show);
router.get("/edit/:id", edit);
router.put(
  "/update/:id",
  multer({ dest: os.tmpdir() }).array("imageId"),
  update
);
router.delete("/destroy/:id", destroy);
router.get("/show-detail-item/:itemId", showDetailItem);
router.post(
  "/store/feature",
  multer({ dest: os.tmpdir() }).single("imageUrl"),
  storeFeature
);
router.put(
  "/show-detail-item/:itemId/update-feature",
  multer({ dest: os.tmpdir() }).single("imageUrlInModal"),
  updateFeature
);
router.delete("/show-detail-item/:itemId/destroy/:id", destroyFeature);
router.post(
  "/store/activity",
  multer({ dest: os.tmpdir() }).single("imageUrl"),
  storeActivity
);
router.put(
  "/show-detail-item/:itemId/update-activity",
  multer({ dest: os.tmpdir() }).single("imageUrlInModalActivity"),
  updateActivity
);
router.delete(
  "/show-detail-item/:itemId/destroy-activity/:id",
  destroyActivity
);

module.exports = router;
