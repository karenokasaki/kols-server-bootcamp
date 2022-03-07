const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LogSchema = new Schema({
  userName: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  business: { type: mongoose.Schema.Types.ObjectId, ref: "Business" },
  nameProduct: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  date: { type: Date, default: Date.now },
  quantityInput: { type: Number, min: 0 },
  quantityOutput: { type: Number, min: 0 },
  salePrice: { type: Number },
  purchasePrice: { type: Number },
});

const LogModel = mongoose.model("Log", LogSchema);

module.exports = LogModel;
