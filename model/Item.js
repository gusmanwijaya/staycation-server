const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Item title is required"],
    },
    price: {
      type: Number,
      required: [true, "Item price is required"],
    },
    sumBooking: {
      type: Number,
      default: 0,
    },
    country: {
      type: String,
      required: [true, "Item country is required"],
    },
    city: {
      type: String,
      required: [true, "Item city is required"],
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      required: [true, "Item description is required"],
    },
    unit: {
      type: String,
      default: "per night",
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    imageId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image",
      },
    ],
    featureId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Feature",
      },
    ],
    activityId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activity",
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

module.exports = mongoose.model("Item", itemSchema);
