const Post = require("../modelos/postModelo")
const Usuario = require("../modelos/usuarioModelo")

const criarPost = async (req, res) => {

    try {
      const {alunoId, categoria, titulo, conteudo, tags} = req.body
  
      const novoPost = new Post({
        alunoId,
        categoria,
        titulo,
        conteudo,
        tags
      })
  
      await novoPost.save()
  
      return res.status(201).json({message: "Pergunta realizada com sucesso !", post: novoPost })
  
      
    } catch (error) {
  
      console.error('Erro ao criar pergunta:', error);
      return res.status(500).json({ message: 'Erro ao criar pergunta.', error });
      
    }
  
  }

  const listarPost = async (req, res) => {
    try {
        // Teste o populate sem limitar apenas ao 'nome'
        const posts = await Post.find().populate('alunoId');
        
        // Imprima os posts no console para ver o resultado do populate
        console.log(posts);

        // Se você quiser transformar a resposta para incluir o nome diretamente, você pode fazer isso aqui
        const resultado = posts.map(post => ({
            id: post._id,
            nome: post.alunoId ? post.alunoId.nome : "Usuário não encontrado", // Verifica se alunoId está populado
            categoria: post.categoria,
            titulo: post.titulo,
            conteudo: post.conteudo,
            tags: post.tags,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
        }));

        res.status(200).json(resultado);
    } catch (error) {
        console.error("Erro ao buscar posts:", error); // Adicione um console.error para mais visibilidade
        res.status(500).json({ message: "Erro ao buscar posts.", error: error.message });
    }
}

  
  
    

  module.exports = {
    criarPost,
    listarPost
  }