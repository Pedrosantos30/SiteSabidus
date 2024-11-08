const Comentario = require("../modelos/comentarioModelo")
const Usuario = require("../modelos/usuarioModelo")
const Post = require("../modelos/postModelo")

const criarComentario = async (req, res) => {
    const { postId } = req.params
    const { usuarioId, conteudo } = req.body
    
    try {
        const post = await Post.findById(postId)
        if (!post) {
            return res.status(404).json({ message: "Post não encontrado" })
        }

        const usuario = await Usuario.findById(usuarioId)
        if (!usuario) {
            return res.status(404).json({ message: "Usuário não encontrado" })
        }

        const timezoneOffset = -3 
        const createdAt = new Date(Date.now() + timezoneOffset * 60 * 60 * 1000)

        const novoComentario = new Comentario({
            postId,
            nome: usuario.nome,
            usuarioId,
            conteudo,
            createdAt,
            updatedAt: createdAt
        })

        await novoComentario.save()

        return res.status(201).json({ 
            message: "Comentário adicionado com sucesso!", 
            comentario: novoComentario
        })

    } catch (error) {
        res.status(500).json({ message: "Erro ao adicionar comentário", error: error.message })        
    }
}

const listarComentario = async (req, res) => {
    const { postId } = req.params

    try {
        const comentarios = await Comentario.find({ postId })
            .populate('usuarioId', 'nome')  
            .sort({ createdAt: -1 })
        if (comentarios.length === 0) {
            return res.status(404).json({ message: "Nenhum comentário encontrado para este post." })
        }

        res.status(200).json(comentarios)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Erro ao listar comentários", error: error.message })
    }
}

const likeComentario = async (req, res) => {
    try {
        const { comentarioId } = req.params
        const { userId } = req.body 

        const comentario = await Comentario.findById(comentarioId)
        if (!comentario) {
            return res.status(404).json({ message: "Comentário não encontrado" })
        }

        const likeIndex = comentario.likes.indexOf(userId)

        if (likeIndex === -1) {
            comentario.likes.push(userId) 
        } else {
            comentario.likes.splice(likeIndex, 1)
        }

        await comentario.save()

        return res.status(200).json({
            message: likeIndex === -1 ? "Comentário curtido!" : "Like removido!",
            comentario
        })
    } catch (error) {
        console.error("Erro ao curtir:", error)
        return res.status(500).json({ message: "Erro ao curtir", error })
    }
}

module.exports = {
    criarComentario,
    likeComentario
}
