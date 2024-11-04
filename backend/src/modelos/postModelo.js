const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    
    alunoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true,
    },

    categoria: {
        type: String,
        enum: ['Tecnologia', 'Saúde', 'Educação', 'Ciência', 'Cultura'],
        required: true,
    },

    titulo: {
        type: String,
        required: true,
    },

    conteudo: {
        type: String,
        required: true,
    },
  
  
    tags: [String],
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Usuario",
        default: [],
    },

}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
