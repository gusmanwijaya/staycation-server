const mongoose = require("mongoose");
const momentTimezone = require("moment-timezone");

const bankSchema = new mongoose.Schema(
  {
    bankName: {
      type: String,
      required: [true, "Bank name is required"],
    },
    bankAccountNumber: {
      type: String,
      required: [true, "Bank account number is required"],
    },
    bankAccountName: {
      type: String,
      required: [true, "Bank account name is required"],
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

module.exports = mongoose.model("Bank", bankSchema);
