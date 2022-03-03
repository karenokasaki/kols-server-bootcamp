//importar o express
const express = require("express");
// instancionar as rotas pegando do express
const router = express.Router();

const ProductsModel = require("../models/Products.model");
const BusinessModel = require("../models/Business.model");


const isAuth = require("../middlewares/isAuth");
const attachCurrentUser = require("../middlewares/attachCurrentUser");


router.get('/', async (req, res) => {
    return res.send('oidsadsadsadadsadsa')
})



module.exports = router;
