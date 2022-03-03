const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LogSchema = new Schema({
    userName: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    nameProduct: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    date: { type: Date, default: Date.now },
    quantityInput: { type: Number },
    quantityOutput: { type: Number },




})

const LogModel = mongoose.model("Log", LogSchema);

module.exports = LogModel;