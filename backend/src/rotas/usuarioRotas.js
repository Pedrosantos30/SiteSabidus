const express = require("express")
const { criarUsuario, listarUsuarios, atualizarUsuario, deletarUsuario, loginUsuario, obterUsuario } = require("../controladores/usuarioControlador")
const { criarPost, listarPost } = require("../controladores/postControlador")
const router = express.Router()

router.post("/", criarUsuario)

router.get("/", listarUsuarios)

router.get("/:id", obterUsuario);

router.put("/:id", atualizarUsuario)

router.delete("/:id", deletarUsuario)

router.post("/login", loginUsuario)

router.post("/posts", criarPost)

router.get("/posts", listarPost)


module.exports = router