const Usuario = require("../modelos/usuarioModelo")
const bcrypt = require("bcrypt");

const criarUsuario = async (req, res) => {
  const { nome, email, senha, curso, disciplina, periodo, tipoUsuario } =
    req.body
 
 if (!nome || !email || !senha || !curso || !periodo || !tipoUsuario) {
    return res.status(400).json({message: "Todos os campos são obrigatorios."})
 }
 
 if (tipoUsuario === 'monitor' && !disciplina) {
    return res.status(400).json({message:"O monitor precisa informar uma disciplina."})
 }
    try {

    const senhaHashed = await bcrypt.hash(senha, 10);

    const novoUsuario = new Usuario({
      nome,
      email,
      senha: senhaHashed,
      curso,
      disciplina,
      periodo,
      tipoUsuario,
    });

    await novoUsuario.save()

    res.status(201).json({ message: "Usuário criado com sucesso!" })

  } catch (error) {
    res.status(400).json({ message: "Erro ao criar usuário.", error: error.message })
  }
};

const listarUsuarios = async (req, res) => {
    try {
      const usuarios = await Usuario.find()
      res.status(200).json(usuarios);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar usuários.", error: error.message })
    }
  }


  const atualizarUsuario = async (req, res) => {
    const { id } = req.params
    const { nome, email, senha, curso, disciplina, periodo, tipoUsuario } = req.body
  
    try {
      const usuarioAtualizado = await Usuario.findByIdAndUpdate(id, {
        nome,
        email,
        senha,
        curso,
        disciplina,
        periodo,
        tipoUsuario,
      }, { new: true })
  
      if (!usuarioAtualizado) {
        return res.status(404).json({ message: "Usuário não encontrado." })
      }
  
      res.status(200).json({ message: "Usuário atualizado com sucesso!", usuario: usuarioAtualizado })
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar usuário.", error: error.message })
    }
  }

  const deletarUsuario = async (req, res) => {
    const { id } = req.params; 
  
    try {
      const usuarioDeletado = await Usuario.findByIdAndDelete(id)
  
      if (!usuarioDeletado) {
        return res.status(404).json({ message: "Usuário não encontrado." })
      }
  
      res.status(200).json({ message: "Usuário deletado com sucesso!" })
    } catch (error) {
      res.status(500).json({ message: "Erro ao deletar usuário.", error: error.message })
    }
  }



const loginUsuario = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ message: "Usuário não encontrado" });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ message: "Senha incorreta" });
    }

    res.status(200).json({ message: "Login bem-sucedido" });
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor", error: error.message });
  }
};


  

module.exports = {
  criarUsuario,
  listarUsuarios,
  atualizarUsuario,
  deletarUsuario,
  loginUsuario
}
