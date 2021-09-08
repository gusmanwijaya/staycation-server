const mongoose = require("mongoose");
const momentTimezone = require("moment-timezone");

const imageSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: [true, "Image url is required"],
    },
  },
  {
    timestamps: {
      currentTime: () => momentTimezone.tz.setDefault("Asia/Jakarta"),
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

module.exports = mongoose.model("Image", imageSchema);
