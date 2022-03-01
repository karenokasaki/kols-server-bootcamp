const expressJWT = require("express-jwt");

// Verifica a existência e extrai o TOKEN do cabeçalho da requisição.
function extractTokenFromHeaders(req, res) {
  if (!req.headers.authorization) {
    console.error("Missing Auth Header");
    // retorna bad request
    return res.status(400).json({ msg: "Missing Auth Header" });
  }
  return req.headers.authorization.split(" ")[1];
}

// O export exporta o retorno da função
module.exports = expressJWT({
  secret: process.env.TOKEN_SIGN_SECRET,
  userProperty: "user",
  getToken: extractTokenFromHeaders,
  algorithms: ["HS256"],
});
