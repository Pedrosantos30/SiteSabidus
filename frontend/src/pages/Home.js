import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PostForm from '../components/PostForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { postData as createPost, deletePostAPI, likePost, deleteComment, addComment } from '../service/api';
import { 
  faArrowUp, 
  faComment, 
  faTrash,
  faFire,
  faShare,
  faChartSimple 
} from '@fortawesome/free-solid-svg-icons';
import { getPosts } from '../service/api';

const CommentSection = ({ post, user, updatePosts, formatDate }) => {
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsLoading(true);
    try {
      const commentData = {
        usuarioId: user.id,
        nome: user.nome,
        conteudo: newComment
      };

      const updatedPost = await addComment(post._id, commentData);
      
      updatePosts(prevPosts => 
        prevPosts.map(p => 
          p._id === post._id ? updatedPost : p
        )
      );
      
      setNewComment('');
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
      alert('Erro ao adicionar comentário. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteComment = async (comentarioId) => {
    if (!user || !window.confirm('Tem certeza que deseja excluir este comentário?')) return;

    try {
      await deleteComment(post._id, comentarioId, user.id);
      
      updatePosts(prevPosts => 
        prevPosts.map(p => 
          p._id === post._id 
            ? {
                ...p,
                comentarios: p.comentarios.filter(c => c._id !== comentarioId)
              }
            : p
        )
      );
    } catch (error) {
      console.error('Erro ao excluir comentário:', error);
      alert('Erro ao excluir comentário. Tente novamente.');
    }
  };

  return (
    <div className="mt-4">
      {user && (
        <form onSubmit={handleAddComment} className="mb-3">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Escreva um comentário..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isLoading || !newComment.trim()}
            >
              Comentar
            </button>
          </div>
        </form>
      )}

      <div className="comments-list">
        {post.comentarios && post.comentarios.map(comment => (
          <div key={comment._id} className="comment-item p-3 mb-2 bg-light rounded">
            <div className="d-flex justify-content-between align-items-start">
              <div className="d-flex gap-2">
                <img
                  src={`https://ui-avatars.com/api/?name=${comment.nome}&background=random`}
                  alt="Avatar"
                  className="rounded-circle"
                  width="32"
                  height="32"
                />
                <div>
                  <div className="fw-bold">{comment.nome}</div>
                  <small className="text-muted">
                    {formatDate(comment.createdAt)}
                  </small>
                </div>
              </div>
              {user && comment.usuarioId === user.id && (
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDeleteComment(comment._id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              )}
            </div>
            <p className="mt-2 mb-0">{comment.conteudo}</p>
          </div>
        ))}
      </div>
    </div>
  );
};


const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [sortBy, setSortBy] = useState('recent');
  const [loading, setLoading] = useState(true);
  const [expandedComments, setExpandedComments] = useState(new Set());

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await getPosts();
      const sortedPosts = [...fetchedPosts].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setPosts(sortedPosts);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
      setLoading(false);
    }
  };

  const toggleComments = (postId) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: 'numeric',
      timeZone: 'America/Sao_Paulo' 
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  const addPost = async (title, content) => {
    if (!user) return;

    try {
      const newPostData = {
        titulo: title,
        conteudo: content,
        categoria: "Geral",
      };

      const createdPost = await createPost(newPostData);
      setPosts(prevPosts => [createdPost, ...prevPosts]);
    } catch (error) {
      console.error('Erro ao criar post:', error);
      alert('Erro ao criar post. Tente novamente.');
    }
  };

  const votePost = async (postId) => {
    if (!user) {
      alert("Você precisa estar logado para votar em um post!");
      return;
    }
  
    try {
      await likePost(postId, user.id);
      
      setPosts(posts.map(post => {
        if (post._id === postId) {
          const hasVoted = post.likes.includes(user.id);
          const newLikes = hasVoted 
            ? post.likes.filter(id => id !== user.id)
            : [...post.likes, user.id]; 
          return { ...post, likes: newLikes };
        }
        return post;
      }));
  
    } catch (error) {
      console.error('Erro ao votar no post:', error);
      alert('Erro ao votar no post. Tente novamente.');
    }
  };

  const deletePost = async (postId) => {
    if (!user) return;
    
    if (window.confirm('Tem certeza que deseja excluir este post?')) {
      try {
        await deletePostAPI(postId);
        setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
      } catch (error) {
        console.error('Erro ao excluir post:', error);
        alert('Erro ao excluir post. Tente novamente.');
      }
    }
  };

  const sortPosts = (method) => {
    setSortBy(method);
    let sortedPosts = [...posts];
    
    switch (method) {
      case 'trending':
        sortedPosts.sort((a, b) => b.likes.length - a.likes.length);
        break;
      case 'recent':
        sortedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'comments':
        sortedPosts.sort((a, b) => (b.comments || 0) - (a.comments || 0));
        break;
      default:
        break;
    }
    
    setPosts(sortedPosts);
  };

  return (
    posts ? (
      <div className="home-container">
        <div className="container py-4">
          <div className="row justify-content-center">
            {/* Sidebar Esquerda */}
            <div className="col-lg-3 d-none d-lg-block">
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                  <h5 className="card-title h6 mb-3">Navegação</h5>
                  <div className="list-group list-group-flush">
                    <button 
                      className={`list-group-item list-group-item-action d-flex align-items-center gap-2 ${sortBy === 'recent' ? 'active' : ''}`}
                      onClick={() => sortPosts('recent')}
                    >
                      <FontAwesomeIcon icon={faChartSimple} />
                      Mais Recentes
                    </button>
                    <button 
                      className={`list-group-item list-group-item-action d-flex align-items-center gap-2 ${sortBy === 'trending' ? 'active' : ''}`}
                      onClick={() => sortPosts('trending')}
                    >
                      <FontAwesomeIcon icon={faFire} />
                      Em Alta
                    </button>
                  </div>
                </div>
              </div>
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                  <h5 className="card-title h6 mb-3">Categorias</h5>
                  <div className="d-flex flex-column gap-2">
                    {['Tecnologia', 'Saúde', 'Educação', 'Ciência', 'Cultura'].map(category => (
                      <a 
                        key={category}
                        href="#" 
                        className="text-decoration-none text-muted d-flex align-items-center gap-2"
                      >
                        <span className="badge rounded-pill bg-light text-dark">
                          {posts.filter(post => post.categoria === category).length}
                        </span>
                        {category}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Conteúdo Principal */}
            <div className="col-lg-6 col-md-12">
              <div className="welcome-section text-center mb-4 p-4 bg-white rounded shadow-sm">
                <h1 className="display-5 mb-3">Bem-vindo ao Sabidus!</h1>
                <p className="lead text-muted">
                  Compartilhe conhecimento, aprenda e conecte-se com pessoas interessantes.
                </p>
                {!user && (
                  <div className="mt-3">
                    <button 
                      className="btn btn-primary me-2"
                      onClick={() => navigate('/login')}
                    >
                      Fazer Login
                    </button>
                    <button 
                      className="btn btn-outline-primary"
                      onClick={() => navigate('/register')}
                    >
                      Criar Conta
                    </button>
                  </div>
                )}
              </div>

              {user && (
                <div className="mb-4">
                  <PostForm user={user} addPost={addPost} />
                </div>
              )}

<div className="posts-list">
          {posts.map(post => (
            <div 
              key={post._id} 
              className="card mb-4 border-0 shadow-sm post-card"
            >
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <img 
                      src={`https://ui-avatars.com/api/?name=${post.alunoId?.nome || 'Usuario'}&background=random`}
                      alt="Avatar"
                      className="rounded-circle"
                      width="40"
                      height="40"
                    />
                    <div>
                      <div className="fw-bold">{post.alunoId?.nome || 'Usuário'}</div>
                      <small className="text-muted">
                        {formatDate(post.createdAt)}
                      </small>
                    </div>
                  </div>
                  <span className="badge bg-light text-dark">
                    {post.categoria}
                  </span>
                </div>

                <h3 className="h5 mb-3">{post.titulo}</h3>
                <p className="card-text">{post.conteudo}</p>

                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div className="d-flex gap-3">
                    <button 
                      className={`btn btn-sm ${post.likes?.includes(user?.id) ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => votePost(post._id)}
                      disabled={!user}
                    >
                      <FontAwesomeIcon icon={faArrowUp} />
                      <span className="ms-1">{post.likes?.length || 0}</span>
                    </button>
                    <button 
                      className={`btn btn-sm ${expandedComments.has(post._id) ? 'btn-primary' : 'btn-outline-secondary'}`}
                      onClick={() => toggleComments(post._id)}
                    >
                      <FontAwesomeIcon icon={faComment} />
                      <span className="ms-1">{post.comentarios?.length || 0}</span>
                    </button>
                    <button 
                      className="btn btn-sm btn-outline-secondary"
                      disabled={!user}
                    >
                      <FontAwesomeIcon icon={faShare} />
                    </button>
                  </div>
                  {user && post.alunoId?._id === user.id && (
                    <button 
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => deletePost(post._id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  )}
                </div>

                {expandedComments.has(post._id) && (
                  <CommentSection
                    post={post}
                    user={user}
                    updatePosts={setPosts}
                    formatDate={formatDate}
                  />
                )}
              
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar Direita */}
            <div className="col-lg-3 d-none d-lg-block">
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                  <h5 className="card-title h6 mb-3">Tópicos em Alta</h5>
                  <div className="d-flex flex-wrap gap-2">
                    {['#Tecnologia', '#Inovação', '#Ciência', '#Saúde', '#Educação'].map(tag => (
                      <span key={tag} className="badge bg-primary">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>

              {user && (
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title h6 mb-3">Sua Atividade</h5>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Posts</span>
                      <span className="badge bg-light text-dark">
                        {posts.filter(post => post.alunoId._id === user.id).length}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Votos dados</span>
                      <span className="badge bg-light text-dark">
                        {posts.reduce((count, post) => 
                          count + (post.likes.includes(user.id) ? 1 : 0), 0
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <style>
          {`
            .home-container {
              background-color: #f8f9fa;
              min-height: calc(100vh - 56px);
              padding-top: 1rem;
            }

            .welcome-section {
              background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }

            .post-card {
              transition: all 0.2s ease-in-out;
              border-radius: 8px;
            }

            .post-card:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }

            .btn-sm {
              padding: .25rem .5rem;
              font-size: .875rem;
              border-radius: .2rem;
            }

            .badge {
              font-weight: 500;
              padding: 0.5em 1em;
            }

            .list-group-item-action {
              border: none;
              padding: .5rem 1rem;
            }

            .list-group-item-action:hover {
              background-color: #f8f9fa;
            }

            .list-group-item-action.active {
              background-color: #3498DB;
              border-color: #3498DB;
            }

            .btn-primary {
              background-color: #3498DB;
              border-color: #3498DB;
            }

            .btn-primary:hover {
              background-color: #2980b9;
              border-color: #2980b9;
            }

            .btn-outline-primary {
              color: #3498DB;
              border-color: #3498DB;
            }

            .btn-outline-primary:hover {
              background-color: #3498DB;
              border-color: #3498DB;
            }

            .badge.bg-primary {
              background-color: #3498DB !important;
            }

            h1, .h1 {
              color: #2C3E50;
            }

            @media (max-width: 768px) {
              .display-5 {
                font-size: 1.8rem;
              }
              
              .lead {
                font-size: 1rem;
              }

              .post-card {
                margin: 0 -12px;
                border-radius: 0;
              }
            }
          `}
        </style>
      </div>
    ) : null
  );
};

export default Home;