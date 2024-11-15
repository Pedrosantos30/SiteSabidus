import React, { useState, useEffect } from 'react';
import { postData } from '../service/api'; // Importe a função postData do api.js

const PostForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Tecnologia'); // Definindo uma categoria padrão
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [user, setUser] = useState(null); // Estado para armazenar o usuário logado

  useEffect(() => {
    // Verifica se o usuário está logado
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setErrorMessage('Você precisa estar logado para criar uma publicação.');
      return;
    }

    try {
      // Crie o objeto do post com os dados do formulário
      const postDataObj = {
        alunoId: user.id, // Adiciona o ID do usuário logado
        titulo: title,
        conteudo: content,
        categoria: category,
      };

      // Envie o post ao backend
      const response = await postData(postDataObj);

      // Mensagem de sucesso
      setSuccessMessage('Publicação criada com sucesso!');
      setTitle(''); // Limpa o título
      setContent('');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
       // Limpa o conteúdo
      } catch (error) {
        setErrorMessage('Erro ao criar publicação. Tente novamente.');
        console.error('Erro ao enviar post:', error);
        
        // Remove a mensagem de erro após 3 segundos
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      }
    };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title">Criar uma nova publicação</h5>
        {successMessage && <div className="alert alert-success">{successMessage}</div>}
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        <form id="new-post-form" onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              id="post-title"
              placeholder="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <textarea
              className="form-control"
              id="post-content"
              rows="3"
              placeholder="Conteúdo"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <select
              className="form-control"
              id="post-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="Tecnologia">Tecnologia</option>
              <option value="Saúde">Saúde</option>
              <option value="Educação">Educação</option>
              <option value="Ciência">Ciência</option>
              <option value="Cultura">Cultura</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" id="submit-post">
            Publicar
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostForm;
