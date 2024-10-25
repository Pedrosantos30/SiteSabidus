import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TrendingTopics from './TrendingTopics';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBrain, faUserCircle, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white mt-3" style={{ border: 'none', boxShadow: 'none', marginBottom: '50px' }}>
      <div className="container-fluid">
        {/* Logo */}
        <a className="navbar-brand" href="#" style={{ display: 'flex', alignItems: 'center' }}>
          <FontAwesomeIcon
            icon={faBrain}
            style={{ fontSize: '2rem', color: '#3498DB', marginRight: '0.5rem' }}
          />
          <h1 className="d-none d-lg-block" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: '700', fontSize: '1.5rem', color: '#2C3E50', margin: 0 }}>
            Sabi<span style={{ color: '#3498DB' }}>dus</span>
          </h1>
        </a>

        {/* Controles Mobile */}
        <div className="d-flex align-items-center gap-3 d-lg-none">
          <button
            className="btn btn-link p-1 text-dark"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            style={{ fontSize: '1.25rem' }}
          >
            <FontAwesomeIcon icon={isSearchOpen ? faTimes : faSearch} />
          </button>
          {user && (
            <div className="dropdown">
              <a 
                className="nav-link"
                href="#" 
                id="profileDropdownMobile" 
                role="button" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
              >
                <FontAwesomeIcon icon={faUserCircle} style={{ fontSize: '2rem', color: '#3498DB' }} />
              </a>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdownMobile">
                <li><a className="dropdown-item" href="#" onClick={() => navigate('/profile')}>Meu Perfil</a></li>
                <li><a className="dropdown-item" href="#">Configurações</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li><a className="dropdown-item text-danger" href="#" onClick={logout}>Sair</a></li>
              </ul>
            </div>
          )}
          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>

        {/* Menu Desktop e Mobile */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="trendingTopicsDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Tópicos em Alta
              </a>
              <div className="dropdown-menu" aria-labelledby="trendingTopicsDropdown">
                <div className="dropdown-item">
                  <TrendingTopics />
                </div>
              </div>
            </li>
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

          {/* Barra de Pesquisa Desktop */}
          <form className="d-none d-lg-flex me-3" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Pesquisar"
              aria-label="Pesquisar"
            />
            <button className="btn btn-primary" type="submit">Buscar</button>
          </form>

          {/* Auth Section Desktop */}
          <div className="d-none d-lg-flex">
            {!user ? (
              <div className="d-flex gap-2">
                <button className="btn btn-primary" onClick={() => navigate('/login')}>Login</button>
                <button className="btn btn-secondary" onClick={() => navigate('/register')}>Registrar</button>
              </div>
            ) : (
              <div className="dropdown">
                <a 
                  className="nav-link dropdown-toggle"
                  href="#" 
                  id="profileDropdown" 
                  role="button" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                >
                  <FontAwesomeIcon icon={faUserCircle} style={{ fontSize: '2rem', color: '#3498DB' }} />
                </a>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                  <li><a className="dropdown-item" href="#" onClick={() => navigate('/profile')}>Meu Perfil</a></li>
                  <li><a className="dropdown-item" href="#">Configurações</a></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><a className="dropdown-item text-danger" href="#" onClick={logout}>Sair</a></li>
                </ul>
              </div>
            )}
          </div>

          {/* Auth Section Mobile */}
          <div className="d-lg-none mt-3">
            {!user && (
              <div className="d-flex flex-column gap-2">
                <button className="btn btn-primary" onClick={() => navigate('/login')}>Login</button>
                <button className="btn btn-secondary" onClick={() => navigate('/register')}>Registrar</button>
              </div>
            )}
          </div>
        </div>

        {/* Barra de Pesquisa Mobile */}
        {isSearchOpen && (
          <div className="w-100 d-lg-none mt-2">
            <form className="d-flex" role="search">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Pesquisar"
                aria-label="Pesquisar"
              />
              <button className="btn btn-primary" type="submit">Buscar</button>
            </form>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;