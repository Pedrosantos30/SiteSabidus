import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Importação do JS do Bootstrap
import { useAuth } from '../context/AuthContext';
import TrendingTopics from './TrendingTopics'; // Importe seu componente de Tópicos em Alta

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white mt-3" style={{ border: 'none', boxShadow: 'none', marginBottom: '50px' }}>
      <div className="container-fluid">
        <a className="navbar-brand" href="#">Logo</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-center"> {/* Centraliza o conteúdo */}
          <ul className="navbar-nav me-3">
            {/* Tópicos em Alta */}
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="trendingTopicsDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Tópicos em Alta
              </a>
              <div className="dropdown-menu" aria-labelledby="trendingTopicsDropdown">
                <div className="dropdown-item" style={{ backgroundColor: 'white' }}>
                  <TrendingTopics /> {/* Renderiza o componente de Tópicos em Alta aqui */}
                </div>
              </div>
            </li>
          </ul>

          {/* Formulário de Pesquisa */}
          <form className="d-flex" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Pesquisar"
              aria-label="Pesquisar"
            />
            <button className="btn btn-primary" type="submit">Buscar</button>
          </form>

          <ul className="navbar-nav ms-3"> {/* Alterado de 'me-3' para 'ms-3' para espaçamento à esquerda */}
            {/* Categorias */}
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="categoriesDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Categorias
              </a>
              <ul className="dropdown-menu" aria-labelledby="categoriesDropdown">
                <li><a className="dropdown-item" href="#">Tecnologia</a></li>
                <li><a className="dropdown-item" href="#">Saúde</a></li>
                <li><a className="dropdown-item" href="#">Entretenimento</a></li>
                <li><a className="dropdown-item" href="#">Educação</a></li>
                <li><a className="dropdown-item" href="#">Esportes</a></li>
              </ul>
            </li>
          </ul>
        </div>

        <ul className="navbar-nav ms-auto">
          {!user && (
            <>
              <li className="nav-item">
                <button className="btn btn-primary me-2" onClick={() => navigate('/login')}>Login</button>
              </li>
              <li className="nav-item">
                <button className="btn btn-secondary me-2" onClick={() => navigate('/register')}>Registrar</button>
              </li>
            </>
          )}
          {user && (
            <li className="nav-item">
              <button className="btn btn-danger" onClick={logout}>Sair</button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
