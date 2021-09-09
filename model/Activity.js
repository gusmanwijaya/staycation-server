const mongoose = require("mongoose");

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
    itemId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
      },
    ],
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

module.exports = mongoose.model("Activity", activitySchema);
