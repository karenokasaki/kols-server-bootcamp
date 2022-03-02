const mongoose = require("mongoose")
const Schema = mongoose.Schema

/* require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency; */


const ProductSchema = new Schema({

    name: { type: String, required: true },
    desc: { type: String, required: true },
    partNumber: { type: String, required: true },
    quantity: { type: Number, required: true },
    category: { type: String, required: true },
    purchasePrice: { type: Number, required: true },
    salePrice: { type: Number, required: true },
    supplier: { type: String, required: true },
    resupplyPoint: { type: String, required: true },
    img: { type: String, default: 'logo da empresa', required: true },
    business: { type: mongoose.Schema.Types.ObjectId, ref: "Business", required: true },
    isActive: { type: Boolean, default: true, required: true },
    createDate: { type: Date, default: Date.now, required: true },

})

const ProductModel = mongoose.model("Product", ProductSchema)

module.exports = ProductModel