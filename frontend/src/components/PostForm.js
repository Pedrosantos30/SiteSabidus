import React, { useState } from 'react';

const PostForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Simule o estado de login

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você pode adicionar a lógica para enviar o post
    console.log('Post enviado:', { title, content });
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title">Criar uma nova publicação</h5>
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
          <button type="submit" className="btn btn-primary" id="submit-post">
            Publicar
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostForm;
