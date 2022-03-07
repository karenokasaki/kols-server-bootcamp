//importar o express
const express = require("express");
// instanciar as rotas pegando do express
const router = express.Router();

const ProductsModel = require("../models/Products.model");
const BusinessModel = require("../models/Business.model");

const isAuth = require("../middlewares/isAuth");
const attachCurrentUser = require("../middlewares/attachCurrentUser");
const LogModel = require("../models/Log.model");
const UserModel = require("../models/User.model");

// Rota para criar um produto
router.post("/:idBusiness/create-product", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const { idBusiness } = req.params
    const loggedUser = req.currentUser;

    // Verifica se a conta do usuário está ativa.
    if (!loggedUser.userIsActive) {
      return res.status(404).json({ msg: "User disable account." });
    }

    const newProduct = await ProductsModel.create({
      ...req.body,
      business: idBusiness,
    });

    await BusinessModel.findOneAndUpdate(
      { _id: idBusiness },
      { $push: { products: newProduct._id } }
    );

    return res.status(201).json(newProduct);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});

// Rota para buscar todos os produtos
router.get("/:idBusiness", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const { idBusiness } = req.params;
    const loggedUser = req.currentUser;

    // Verifica se a conta do usuário está ativa.
    if (!loggedUser.userIsActive) {
      return res.status(404).json({ msg: "User disable account." });
    }

    const products = await ProductsModel.find({ business: idBusiness });

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

//adiciona na quantidade do produto no BD
router.patch("/input-product", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const loggedUser = req.currentUser;

    const productSent = await ProductsModel.findById(req.body._id);

    const productToUpdate = await ProductsModel.findOneAndUpdate(
      { _id: req.body._id },
      { $set: { quantity: req.body.quantity + productSent.quantity } },
      { new: true }
    );

    await LogModel.create({
      userName: loggedUser._id,
      nameProduct: productSent._id,
      business: productToUpdate.business,
      quantityInput: req.body.quantity,
      purchasePrice: req.body.purchasePrice,
    });

    return res.status(200).json(productToUpdate);
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
});

//subtrai na quantidade do produto no BD
router.patch("/output-product", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const loggedUser = req.currentUser;

    const productSent = await ProductsModel.findById(req.body._id);

    //verifica se o estoque não vai ficar negativo depois da subtração
    if (productSent.quantity - req.body.quantity < 0) {
      return res.status(400).json("Estoque indisponível");
    }

    const productToUpdate = await ProductsModel.findOneAndUpdate(
      { _id: req.body._id },
      { $set: { quantity: productSent.quantity - req.body.quantity } },
      { new: true }
    );

    const log = await LogModel.create({
      userName: loggedUser._id,
      nameProduct: productSent._id,
      business: productToUpdate.business,
      quantityOutput: req.body.quantity,
      salePrice: req.body.salePrice,
    });

    console.log(log);

    return res.status(200).json(productToUpdate);
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
});

module.exports = router;
