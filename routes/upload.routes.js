//importar o express
const express = require("express");
// instanciar as rotas pegando do express
const router = express.Router();

const isAuth = require("../middlewares/isAuth");
const attachCurrentUser = require("../middlewares/attachCurrentUser");

const uploadCloud = require("../config/cloudinary.config");

// Rota para enviar um arquivo de imagem.
// O arquivo é enviado ao cloudinary, e retorna um link que será enviado ao server
router.post(
  "/image",
  isAuth,
  attachCurrentUser,
  uploadCloud.single("picture"),
  (req, res) => {
    const loggedUser = req.currentUser;

    // Verifica se a conta do usuário está ativa.
    if (!loggedUser.userIsActive) {
      return res.status(404).json({ msg: "User disable account." });
    }

    // Verifica se há um arquivo na request
    if (!req.file) {
      return res.status(500).json({ message: "Upload failed" });
    }

    return res.status(201).json({ url: req.file.path });
  }
);

module.exports = router;
