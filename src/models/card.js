const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minLength: 2,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      minLength: 5,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Card = mongoose.model("Card", cardSchema);

module.exports = {
  Card,
};
