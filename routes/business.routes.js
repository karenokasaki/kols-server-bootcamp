//importar o express
const express = require("express");
// instanciar as rotas pegando do express
const router = express.Router();

const BusinessModel = require("../models/Business.model");
const userModel = require("../models/User.model");
const logModel = require("../models/Log.model");

const isAuth = require("../middlewares/isAuth");
const attachCurrentUser = require("../middlewares/attachCurrentUser");

// Rota para criar uma nova empresa
router.post("/create-business", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const loggedUser = req.currentUser;

    // Verifica se a conta do usuário está ativa.
    if (!loggedUser.userIsActive) {
      return res.status(404).json({ msg: "User disable account." });
    }

    const newBusiness = await BusinessModel.create({
      ...req.body,
      owner: loggedUser._id,
    });

    // Atualiza o role do user no momento da criação do business
    await userModel.findOneAndUpdate(
      { _id: loggedUser._id },
      { role: "ADMIN" }
    );

    await userModel.findByIdAndUpdate(
      { _id: loggedUser._id },
      { $push: { business: newBusiness._id } }
    );

    // Deleta a versão no retorno da atualização
    delete newBusiness._doc.__v;

    return res.status(201).json(newBusiness);
  } catch (error) {
    // retorna Internal Server Error
    console.log(error)
    return res.status(500).json({ msg: error.message });
  }
});

// Rota para buscar uma empresa
router.get("/profile/:id", isAuth, attachCurrentUser, async (req, res) => {
  const { id } = req.params;
  try {
    const loggedUser = req.currentUser;

    // Verifica se a conta do usuário e empresa está ativa.
    const businessCheck = await BusinessModel.findById(id);

    if (!loggedUser.userIsActive || !businessCheck.businessIsActive) {
      return res.status(404).json({ msg: "User or Business is disable." });
    }

    const business = await BusinessModel.findById(id)
      .populate("owner")
      .populate("products");

    // Deleta o password e a versão no retorno da atualização
    delete business.owner._doc.passwordHash;
    delete business.owner._doc.__v;
    delete business._doc.__v;

    return res.status(200).json(business);
  } catch (error) {
    // retorna Internal Server Error
    return res.status(500).json({ msg: error.message });
  }
});

// Rota para atualizar empresa
router.patch("/update/:id", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const { id } = req.params;
    const loggedUser = req.currentUser;

    // Verifica se a conta do usuário e empresa está ativa.
    const businessCheck = await BusinessModel.findById(id);

    if (!loggedUser.userIsActive || !businessCheck.businessIsActive) {
      return res.status(404).json({ msg: "User or Business is disable." });
    }

    const updateBusiness = await BusinessModel.findOneAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true, runValidators: true }
    );

    return res.status(200).json(updateBusiness);
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
});

// Rota para um soft delete da empresa
// Verifica se o usuário esta logado, identifica o ID do business e "deleta" do banco de dados.
router.delete(
  "/:idBusiness/disable-business",
  isAuth,
  attachCurrentUser,
  async (req, res) => {
    try {
      const { idBusiness } = req.params;
      const loggedUser = req.currentUser;

      const disableBusiness = await BusinessModel.findOneAndUpdate(
        { _id: idBusiness },
        { businessIsActive: false },
        { new: true }
      );

      return res.status(200).json(disableBusiness);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }
);

// Rota active business
router.patch(
  "/:idBusinessDisable/active-business",
  isAuth,
  attachCurrentUser,
  async (req, res) => {
    try {
      const { idBusinessDisable } = req.params;
      const loggedUser = req.currentUser;

      const activeBusiness = await BusinessModel.findOneAndUpdate(
        { _id: idBusinessDisable },
        { businessIsActive: true },
        { new: true }
      );

      return res.status(200).json(activeBusiness);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }
);

// Rota Get de Log
router.get("/:idBusiness/log", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const { idBusiness } = req.params;
    const loggedUser = req.currentUser;

    // Verifica se a conta do usuário e empresa está ativa.
    const businessCheck = await BusinessModel.findById(idBusiness);

    if (!loggedUser.userIsActive || !businessCheck.businessIsActive) {
      return res.status(404).json({ msg: "User or Business is disable." });
    }

    const log = await logModel.find({ business: idBusiness }).populate('nameProduct').populate('userName');

    return res.status(200).json(log);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});

module.exports = router;
