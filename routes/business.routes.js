//importar o express
const express = require("express");
// instancionar as rotas pegando do express
const router = express.Router();

const BusinessModel = require("../models/Business.model");
const userModel = require("../models/User.model");

const isAuth = require("../middlewares/isAuth");
const attachCurrentUser = require("../middlewares/attachCurrentUser");

router.post("/create-business", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const loggedInUser = req.currentUser;

    newBusiness = await BusinessModel.create({
      ...req.body,
      onwer: loggedInUser._id,
    });

    await userModel.findByIdAndUpdate(
      { _id: loggedInUser._id },
      { $push: { business: newBusiness._id } }
    );

    return res.status(201).json(newBusiness);
  } catch (error) {
    // retorna Internal Server Error
    return res.status(500).json({ msg: error.message });
  }
});

router.get("/profile", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const loggedInUser = req.currentUser;
    if (!loggedInUser.isActive) {
      return res.status(404).json({ msg: "User disable account." });
    }

    const business = await BusinessModel.findById(
      loggedInUser.business
    ).populate("onwer");

    console.log(loggedInUser);
    return res.status(200).json(business);
  } catch (error) {
    // retorna Internal Server Error
    return res.status(500).json({ msg: error.message });
  }
});

module.exports = router;
