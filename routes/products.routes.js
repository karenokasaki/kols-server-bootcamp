//importar o express
const express = require("express");
// instanciar as rotas pegando do express
const router = express.Router();

const ProductsModel = require("../models/Products.model");
const BusinessModel = require("../models/Business.model");

const isAuth = require("../middlewares/isAuth");
const attachCurrentUser = require("../middlewares/attachCurrentUser");

// Rota para criar um produto
router.post("/create-product", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const loggedUser = req.currentUser;

    // Verifica se a conta do usuário está ativa.
    if (!loggedUser.userIsActive) {
      return res.status(404).json({ msg: "User disable account." });
    }

    // Seleciona o ID do business
    const businessId = await BusinessModel.findOne({
      _id: loggedUser.business,
    });

    const newProduct = await ProductsModel.create({
      ...req.body,
      business: businessId._id,
    });

    await BusinessModel.findOneAndUpdate(
      { _id: businessId._id },
      { $push: { products: newProduct._id } }
    );

    return res.status(201).json(newProduct);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});

// Rota para buscar todos os produtos
router.get("/all-products", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const loggedUser = req.currentUser;

    // Verifica se a conta do usuário está ativa.
    if (!loggedUser.userIsActive) {
      return res.status(404).json({ msg: "User disable account." });
    }

    // Seleciona o ID do business
    const businessId = await BusinessModel.findOne({
      _id: loggedUser.business,
    });

    const products = await ProductsModel.find();

    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});

// Rota para buscar somente um produto
router.get("/product/:id", isAuth, attachCurrentUser, async (req, res) => {
  const { id } = req.params;

  try {
    const loggedUser = req.currentUser;

    // Verifica se a conta do usuário está ativa.
    if (!loggedUser.userIsActive) {
      return res.status(404).json({ msg: "User disable account." });
    }

    // Seleciona o ID do product
    const productId = await ProductsModel.findOne({
      _id: id,
    });

    return res.status(200).json(productId);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});

// Rota para atualizar um produto
router.patch(
  "/product/update/:id",
  isAuth,
  attachCurrentUser,
  async (req, res) => {
    const { id } = req.params;

    try {
      const loggedUser = req.currentUser;

      // Verifica se a conta do usuário está ativa.
      if (!loggedUser.userIsActive) {
        return res.status(404).json({ msg: "User disable account." });
      }

      const updateProduct = await ProductsModel.findOneAndUpdate(
        { _id: id },
        { ...req.body },
        { new: true, runValidators: true }
      );

      return res.status(200).json(updateProduct);
    } catch (error) {
      return res.status(400).json({ msg: error.message });
    }
  }
);

// Rota para hard delete product
router.delete("/delete/:id", isAuth, attachCurrentUser, async (req, res) => {
  const { id } = req.params;

  try {
    const loggedUser = req.currentUser;

    // Verifica se a conta do usuário está ativa.
    if (!loggedUser.userIsActive) {
      return res.status(404).json({ msg: "User disable account." });
    }

    const businessId = await BusinessModel.findOne({
      _id: loggedUser.business,
    });

    await BusinessModel.findOneAndUpdate(
      { _id: businessId._id },
      { $pull: { products: id } }
    );

    const deletedProduct = await ProductsModel.findOneAndDelete({ _id: id });

    return res.status(200).json(deletedProduct);
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
});

module.exports = router;
