const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    /* match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, */
  },
  birthdate: { type: Date, required: true },
  cpf: {
    type: String,
    required: true,
    unique: true,
    /* match: /^\d{3}.\d{3}.\d{3}-\d{2}$/, */
  },
  rg: {
    type: String,
    required: true,
    /* match: /(\d{1,2}.?)(\d{3}.?)(\d{3})(-?[0-9Xx]{1})/, */
  },
  rgUF: {
    type: String,
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
    required: true,
  },
  phone: {
    type: String,
    required: true,
    /* match: /(^[0-9]{2})?(\s|-)?(9?[0-9]{4})-?([0-9]{4}$)/, */
  },
  address: new Schema({
    street: { type: String, required: true },
    number: { type: Number, required: true },
    district: { type: String, required: true },
    city: { type: String, required: true },
    zipcode: {
      type: String,
      required: true,
      /* match: /^([\d]{5})-?([\d]{3})/, */
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

  business: [{ type: mongoose.Schema.Types.ObjectId, ref: "Business" }],

  passwordHash: { type: String /* required: true */ },
  resetPassword: { type: String, default: "" },

  ownership: { type: mongoose.Schema.Types.ObjectId, ref: "Business" },
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "Business" },
  createDate: { type: Date, required: true, default: Date.now },
  userIsActive: { type: Boolean, default: true },

  role: {
    type: String,
    enum: ["ADMIN", "USER"],
    required: true,
    default: "USER",
  },
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
