const mongoose = require("mongoose")

const entrepreneurSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    businessName: {
      type: String,
      required: true,
      trim: true,
    },

    skillType: {
      type: String,
      required: true,
      trim: true,
    },

    bio: {
      type: String,
      default: "",
    },

    experience: {
      type: Number,
      default: 0,
    },

    location: {
      type: String,
      default: "",
    },

    services: {
      type: [String],
      default: [],
    },

    availability: {
      type: String,
      default: "Available",
    },

    profileImage: {
      type: String,
      default: "",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("Entrepreneur", entrepreneurSchema)