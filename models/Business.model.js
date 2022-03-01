const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BusinessSchema = new Schema({
  corporateName: { type: String, required: true },
  name: { type: String, required: true },
  cnpj: {
    type: Number,
    match: /^\d{2}.\d{3}.\d{3}\/\d{4}-\d{2}$/,
    required: true,
  },
  ie: { type: Number, match: /^\d{3}.\d{3}.\d{3}.\d{3}$/ },
  im: { type: Number, match: /^\d{7}\/\d{3}?-\d{1}$/ },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  },
  phone: {
    type: Number,
    required: true,
    match: /(^[0-9]{2})?(\s|-)?(9?[0-9]{4})-?([0-9]{4}$)/,
    required: true,
  },

  address: new Schema({
    street: { type: String, required: true },
    number: { type: Number, required: true },
    district: { type: String, required: true },
    city: { type: String, required: true },
    zipcode: {
      type: Number,
      required: true,
      match: /^([\d]{2}).?([\d]{3})-?([\d]{3})$/,
    },
    state: {
      type: String,
      required: true,
      emun: [
        "AC",
        "AL",
        "AP",
        "AM",
        "BA",
        "CE",
        "DF",
        "ES",
        "GO",
        "MA",
        "MT",
        "MS",
        "MG",
        "PA",
        "PB",
        "PR",
        "PE",
        "PI",
        "RJ",
        "RN",
        "RS",
        "RO",
        "RR",
        "SC",
        "SP",
        "SE",
        "TO",
      ],
    },
  }),

  onwer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  employee: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Products" }],
});

const BusinessModel = mongoose.model("Business", BusinessSchema);

module.exports = BusinessModel;
