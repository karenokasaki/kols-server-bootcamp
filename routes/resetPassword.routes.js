// import jwt para token temporário
const jwt = require("jsonwebtoken");
// import nodemailer para envio do e-mail
const nodemailer = require("nodemailer");
// import bcrypt para criptografia da senha
const bcrypt = require("bcrypt");
// import router do express
const express = require("express");
const router = express.Router();
// import userModel schema
const userModel = require("../models/User.model");

// config do nodemailer para envio de e-mail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "contato.kols@gmail.com",
    pass: process.env.PASSWORD_EMAIL,
  },
});

// Define a quantidade de "saltos que serão adicionados a criptografia da senha"
const saltRounds = 10;

// Rota de recuperação de senha que recebe o email do usuário solicitante
router.post("/forgot-password", async (req, res) => {
  try {
    // Extrai o e-mail da requisição
    const { email } = req.body;

    // busca o usuário no banco de dados pelo e-mail
    let user = await userModel.findOne({ email });

    // Verifica se o usuário está cadastrado
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    // Gerar token temporário
    const temporaryToken = jwt.sign(
      { _id: user._id },
      process.env.SIGN_SECRET_RESET_PASSWORD,
      { expiresIn: "20m" }
    );

    // Define o token temporário no resetPassword
    await userModel.findOneAndUpdate(
      { _id: user._id },
      { $set: { resetPassword: temporaryToken } }
    );

    // Config do e-mail
    const mailOptions = {
      from: "contato.kols@gmail.com",
      to: user.email,
      subject: "Redefinir Senha",
      html: `<p>Clique no link para redefinir sua senha:<p> <a href=https://kols-client-n655pmdk6-jotavkf.vercel.app/resetPassword/new-password/${temporaryToken}>LINK</a>`,
    };

    // Dispara e-mail para o usuário
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return res.status(500).json({ msg: "Error sending e-mail" });
      }
    });

    return res.status(200).json({ msg: "Email sent successfully" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});

// Rota de atualização da senha e banco
router.put("/new-password/:token", async (req, res) => {
  try {
    // Verifica a existência do token
    if (!req.params.token) {
      return res.status(400).json({ msg: "Incorrect or invalid Token" });
    }

    // Verifica se o token é válido e não esta expirado
    jwt.verify(
      req.params.token,
      process.env.SIGN_SECRET_RESET_PASSWORD,
      err => {
        if (err) {
          return res.status(400).json({ msg: "Incorrect or invalid Token" });
        }
      }
    );

    // Busca o usuário pelo token de recuperação
    let user = await userModel.findOne({ resetPassword: req.params.token });

    // Verifica se o token do usuário existe
    if (!user) {
      return res.status(400).json({ msg: "Incorrect or invalid Token" });
    }

    // Extrai a nova senha do usuário
    const { newPassword } = req.body;

    // Verifica se a senha existe e se atende todos os requisitos
    if (
      !newPassword ||
      !newPassword.match(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/
      )
    ) {
      return res.status(400).json({
        msg: "Password is required and must have at least 8 characters, uppercase and lowercase letters, numbers and special characters.",
      });
    }

    // Gera o salt da senha
    const salt = await bcrypt.genSalt(saltRounds);

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Encontra o usuário pelo ID, define a nova senha e redefine o token temporário.
    await userModel.findOneAndUpdate(
      { _id: user._id },
      { $set: { passwordHash: hashedPassword, resetPassword: "" } }
    );

    return res.status(200).json({ msg: "Password Updated!" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});

module.exports = router;
