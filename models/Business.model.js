const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BusinessSchema = new Schema({
  corporateName: { type: String, required: true },
  name: { type: String, required: true },
  cnpj: {
    type: String,
    /* match: /^\d{2}.\d{3}.\d{3}\/\d{4}-\d{2}$/, */
    required: true,
  },
  ie: { type: String, /* match: /^\d{3}.\d{3}.\d{3}.\d{3}$/ */ },
  im: { type: String, /* match: /^\d{7}\/\d{3}?-\d{1}$/ */ },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    /* match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, */
  },
  phone: {
    type: String,
    required: true,
    /* match: /(^[0-9]{2})?(\s|-)?(9?[0-9]{4})-?([0-9]{4}$)/, */
    required: true,
  },

  address: new Schema({
    street: { type: String, required: true },
    number: { type: String, required: true },
    district: { type: String, required: true },
    city: { type: String, required: true },
    zipcode: {
      type: String,
      required: true,
      /* match: /^([\d]{2}).?([\d]{3})-?([\d]{3})$/, */
    },
    state: {
      type: String,
      required: true,
      enum: [
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

  businessImg: { type: String, default: "logo da empresa" },

  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  employee: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],

  businessIsActive: { type: Boolean, default: true },
});

const BusinessModel = mongoose.model("Business", BusinessSchema);

module.exports = BusinessModel;
