const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    bookingStartDate: {
      type: Date,
      required: [true, "Booking start date is required"],
    },
    bookingEndDate: {
      type: Date,
      required: [true, "Booking end date is required"],
    },
    proofPayment: {
      type: String,
      required: [true, "Booking proof payment is required"],
    },
    fromBank: {
      type: String,
      required: [true, "Booking from bank is required"],
    },
    accountHolder: {
      type: String,
      required: [true, "Booking account holder is required"],
    },
    imageUrl: {
      type: String,
      required: [true, "Booking image is required"],
    },
    status: {
      type: String,
      required: [true, "Booking status is required"],
    },
    itemId: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Item",
        },
        price: {
          type: Number,
          required: [true, "Booking item price is required"],
        },
        perNight: {
          type: Number,
          required: [true, "Booking item per night is required"],
        },
      },
    ],
    memberId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member",
      },
    ],
    bankId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bank",
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

module.exports = mongoose.model("Booking", bookingSchema);
