const mongoose = require("mongoose")

const serviceRequestSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    entrepreneurId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Entrepreneur",
      required: true,
    },

    service: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    requestedDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "rejected",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("ServiceRequest", serviceRequestSchema)