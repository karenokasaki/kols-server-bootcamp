const userModel = require("../models/User.model");

// Verificar se o usuário está logado
module.exports = async (req, res, next) => {
  try {
    const loggedUser = req.user;

    const user = await userModel.findOne(
      {
        _id: loggedUser._id,
      },
      // Excluindo o hash da senha e versão da resposta que vai pro servidor, por segurança
      { passwordHash: 0, __v: 0 }
    );

    if (!user) {
      // retorna Bad Request
      return res.status(400).json({ msg: "User does not exist!" });
    }

    req.currentUser = user;

    next();
  } catch (error) {
    // retorna Internal Server Error
    return res.status(500).json({ msg: error.msg });
  }
};
