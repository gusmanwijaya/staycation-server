const mongoose = require("mongoose");
const momentTimezone = require("moment-timezone");

const memberSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
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

module.exports = mongoose.model("Member", memberSchema);
