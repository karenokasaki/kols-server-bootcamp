// geração de token de acesso
const jwt = require("jsonwebtoken");

function generateToken(user) {
  const { _id, name, email } = user;

  const signature = process.env.TOKEN_SIGN_SECRET;
  const expiration = "6h";

  return jwt.sign({ _id, name, email }, signature, {
    expiresIn: expiration,
  });
}

module.exports = generateToken;
