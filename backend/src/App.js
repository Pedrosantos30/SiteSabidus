const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();

const app = express();

// Habilita o CORS
app.use(cors());

// Permite o recebimento de dados em JSON
app.use(express.json());

// URL do banco de dados do MongoDB
const dbURI = process.env.MONGO_URI;

// Conexão com o banco de dados
mongoose.connect(dbURI)
  .then(() => console.log("Conectado ao Banco!"))
  .catch((erro) => console.log("Erro ao conectar ao banco: ", erro));

// Importa as rotas de usuário
const usuarioRotas = require("./rotas/usuarioRotas");
app.use("/usuarios", usuarioRotas);

// Rota principal
app.get("/", (req, res) => {
  res.send("Rota principal");
});

// Rotas adicionais para manipular usuários, se necessário (opcional)
app.post("/usuarios", (req, res) => {
  // Lógica para adicionar um usuário
  res.send("Usuário adicionado!"); // Exemplo de resposta
});

app.put("/usuarios/:id", (req, res) => {
  // Lógica para atualizar um usuário com base no ID fornecido
  res.send("Usuário atualizado!"); // Exemplo de resposta
});

app.delete("/usuarios/:id", (req, res) => {
  // Lógica para deletar um usuário com base no ID fornecido
  res.send("Usuário deletado!"); // Exemplo de resposta
});

// O servidor escuta na porta 5000
app.listen(5000, () => {
  console.log("Servidor rodando na porta 5000!");
});
