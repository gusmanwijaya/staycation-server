const mongoose = require("mongoose");
const momentTimezone = require("moment-timezone");

const activitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Activity name is required"],
    },
    qty: {
      type: Number,
      required: [true, "Activity quantity is required"],
    },
    imageUrl: {
      type: String,
      required: [true, "Activity image is required"],
    },
    isPopular: {
      type: Boolean,
      default: false,
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

module.exports = mongoose.model("Activity", activitySchema);
