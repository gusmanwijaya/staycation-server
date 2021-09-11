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
    invoice: {
      type: Number,
      required: [true, "Booking invoice is required"],
    },
    payments: {
      proofPayment: {
        type: String,
        required: [true, "Booking proof payment is required"],
      },
      bankFrom: {
        type: String,
        required: [true, "Booking from bank is required"],
      },
      accountHolder: {
        type: String,
        required: [true, "Booking account holder is required"],
      },
      status: {
        type: String,
        required: [true, "Booking status is required"],
      },
    },
    imageUrl: {
      type: String,
    },
    itemId: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
      },
      title: {
        type: String,
        required: [true, "Booking item title is required"],
      },
      price: {
        type: Number,
        required: [true, "Booking item price is required"],
      },
      duration: {
        type: Number,
        required: [true, "Booking item duration is required"],
      },
    },
    total: {
      type: Number,
      required: [true, "Booking item total is required"],
    },
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
    },
    bankId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bank",
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

module.exports = mongoose.model("Booking", bookingSchema);
