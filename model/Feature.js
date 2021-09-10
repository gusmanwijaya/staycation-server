const mongoose = require("mongoose");

const featureSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Feature name is required"],
    },
    qty: {
      type: Number,
      required: [true, "Feature quantity is required"],
    },
    imageUrl: {
      type: String,
      required: [true, "Feature image is required"],
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

module.exports = mongoose.model("Feature", featureSchema);
