const mongoose = require("mongoose");
const momentTimezone = require("moment-timezone");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
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

module.exports = mongoose.model("Category", categorySchema);
