//importar o express
const express = require("express")
// instancionar as rotas pegando do express
const router = express.Router()

const UserModel = require('../models/User.model')


router.post("/create-user", async (req, res) => {
    try {

        const newUser = await UserModel.create(req.body) //cria novo usuário

        return res.status(200).json(newUser)
    } catch (error) {
        return res.status(200).json({ message: error.message })
    }
})




module.exports = router