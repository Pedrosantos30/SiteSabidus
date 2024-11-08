const Post = require("../modelos/postModelo")
const Usuario = require("../modelos/usuarioModelo")



const criarPost = async (req, res) => {
    try {
        const { alunoId, categoria, titulo, conteudo } = req.body

        const usuario = await Usuario.findById(alunoId)
        if (!usuario) {
            return res.status(400).json({ message: "Usuário não encontrado." })
        }

        const timezoneOffset = -3 
        const createdAt = new Date(Date.now() + timezoneOffset * 60 * 60 * 1000)
        const updatedAt = createdAt

        const novoPost = new Post({
            alunoId,
            nome: usuario.nome,
            categoria,
            titulo,
            conteudo,
            createdAt,
            updatedAt
        })

        await novoPost.save()

        const usuarioCompleto = await Usuario.findById(alunoId, 'nome')
        
        return res.status(201).json({ 
            message: "Pergunta realizada com sucesso!", 
            post: {
                ...novoPost.toObject(),
                usuario: usuarioCompleto.nome 
            } 
        })
    } catch (error) {
        console.error("Erro ao criar pergunta:", error)
        return res.status(500).json({ message: "Erro ao criar pergunta.", error })
    }
}



const listarPost = async (req, res) => {
    try {
        const posts = await Post.find().populate('alunoId', 'nome') 
        const postsComNome = posts.map(post => ({
            ...post.toObject(),
            nome: post.alunoId ? post.alunoId.nome : "Usuário desconhecido"
        }))
        res.status(200).json(postsComNome)
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar posts.", error: error.message })
    }
}

const deletarPost = async (req, res) => {
    const { postId } = req.params 

    try {
        const postDeletado = await Post.findByIdAndDelete(postId) 

        if (!postDeletado) {
            return res.status(404).json({ message: "Post não encontrado" }) 
        }

        res.status(200).json({ message: "Post deletado com sucesso!" }) 
    } catch (error) {
        res.status(500).json({ message: "Erro ao deletar post", error: error.message }) 
}
}


const likePost = async (req, res) => {
    try {
        const { postId } = req.params
        const { userId } = req.body 

        const post = await Post.findById(postId)
        if (!post) {
            return res.status(404).json({ message: "Post  não encontrado" })
        }

        const likeIndex = post.likes.indexOf(userId)

        if (likeIndex === -1) {
            post.likes.push(userId) 
        } else {
            post.likes.splice(likeIndex, 1)
        }

        await post.save()

        return res.status(200).json({
            message: likeIndex === -1 ? "Post curtido!" : "Like removido!",
            post
        })
    } catch (error) {
        console.error("Erro ao curtir:", error)
        return res.status(500).json({ message: "Erro ao curtir", error })
    }
}

module.exports = {
    criarPost,
    listarPost,
    deletarPost,
    likePost
}
