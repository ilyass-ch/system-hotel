const mongoose = require("mongoose");
const { Schema } = mongoose;

const thingSchema = new Schema(
  {
    imageUrl: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: "img",
  }
);

module.exports = mongoose.model("Thing", thingSchema);