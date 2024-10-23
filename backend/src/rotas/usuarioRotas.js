const express = require("express")
const { criarUsuario, listarUsuarios, atualizarUsuario, deletarUsuario, loginUsuario } = require("../controladores/usuarioControlador")

const router = express.Router()

router.post("/", criarUsuario)

router.get("/", listarUsuarios)

router.put("/:id", atualizarUsuario)

router.delete("/:id", deletarUsuario)

router.post("/login", loginUsuario);


module.exports = router