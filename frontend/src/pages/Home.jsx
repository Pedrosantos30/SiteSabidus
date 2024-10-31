import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PostForm from '../components/PostForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowUp, 
  faComment, 
  faShare, 
  faTrash,
  faFire,
  faBookmark,
  faChartSimple 
} from '@fortawesome/free-solid-svg-icons';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userVotes, setUserVotes] = useState({});
  const [posts, setPosts] = useState([]);
  const [sortBy, setSortBy] = useState('recent');

  const initialPosts = [
    {
      id: 1,
      title: "Os benefícios da meditação para a saúde mental",
      content: "A meditação tem se mostrado uma prática eficaz para reduzir o estresse e melhorar o bem-estar geral. Estudos recentes demonstram que apenas 10 minutos diários podem trazer benefícios significativos para a saúde mental...",
      author: "MeditacaoFan",
      timestamp: "2023-04-15T10:30:00",
      votes: 42,
      comments: 15,
      category: "Saúde"
    },
    {
      id: 2,
      title: "Como a inteligência artificial está revolucionando a medicina",
      content: "A IA está sendo utilizada para análise de imagens médicas, diagnósticos precoces e desenvolvimento de novos medicamentos. Os avanços recentes mostram um futuro promissor para a medicina personalizada...",
      author: "TechMedico",
      timestamp: "2023-04-14T16:45:00",
      votes: 78,
      comments: 23,
      category: "Tecnologia"
    }
  ];

  useEffect(() => {
    setPosts(initialPosts);
  }, []);

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  const addPost = (title, content) => {
    if (!user) return;

    const newPost = {
      id: posts.length + 1,
      title,
      content,
      author: user.displayName || user.email,
      timestamp: new Date().toISOString(),
      votes: 0,
      comments: 0,
      category: "Geral"
    };

    setPosts([newPost, ...posts]);
  };

  const votePost = (postId) => {
    if (!user) {
      alert("Você precisa estar logado para votar em um post!");
      return;
    }

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const newVotes = userVotes[postId] ? post.votes - 1 : post.votes + 1;
        const newUserVotes = { ...userVotes, [postId]: !userVotes[postId] };
        setUserVotes(newUserVotes);
        return { ...post, votes: newVotes };
      }
      return post;
    });

    setPosts(updatedPosts);
  };

  const deletePost = (postId) => {
    if (!user) return;
    
    if (window.confirm('Tem certeza que deseja excluir este post?')) {
      const updatedPosts = posts.filter(post => post.id !== postId);
      setPosts(updatedPosts);
    }
  };

  const sortPosts = (method) => {
    setSortBy(method);
    let sortedPosts = [...posts];
    
    switch (method) {
      case 'trending':
        sortedPosts.sort((a, b) => b.votes - a.votes);
        break;
      case 'recent':
        sortedPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        break;
      case 'comments':
        sortedPosts.sort((a, b) => b.comments - a.comments);
        break;
      default:
        break;
    }
    
    setPosts(sortedPosts);
  };

  return (
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
                        {posts.filter(post => post.category === category).length}
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
                  key={post.id} 
                  className="card mb-4 border-0 shadow-sm post-card"
                >
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="d-flex align-items-center gap-2">
                        <img 
                          src={`https://ui-avatars.com/api/?name=${post.author}&background=random`}
                          alt="Avatar"
                          className="rounded-circle"
                          width="40"
                          height="40"
                        />
                        <div>
                          <div className="fw-bold">{post.author}</div>
                          <small className="text-muted">
                            {formatDate(post.timestamp)}
                          </small>
                        </div>
                      </div>
                      <span className="badge bg-light text-dark">
                        {post.category}
                      </span>
                    </div>

                    <h3 className="h5 mb-3">{post.title}</h3>
                    <p className="card-text">{post.content}</p>

                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div className="d-flex gap-3">
                        <button 
                          className={`btn btn-sm ${userVotes[post.id] ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => votePost(post.id)}
                          disabled={!user}
                        >
                          <FontAwesomeIcon icon={faArrowUp} />
                          <span className="ms-1">{post.votes}</span>
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-secondary"
                          disabled={!user}
                        >
                          <FontAwesomeIcon icon={faComment} />
                          <span className="ms-1">{post.comments}</span>
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-secondary"
                          disabled={!user}
                        >
                          <FontAwesomeIcon icon={faBookmark} />
                        </button>
                      </div>
                      {user && post.author === user.displayName && (
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => deletePost(post.id)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      )}
                    </div>
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
                      {posts.filter(post => post.author === user.displayName).length}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Votos dados</span>
                    <span className="badge bg-light text-dark">
                      {Object.keys(userVotes).length}
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
  );
};

export default Home;