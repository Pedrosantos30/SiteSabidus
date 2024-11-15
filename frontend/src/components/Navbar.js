import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faBell, 
  faUser,
  faSignOutAlt,
  faCog,
  faBrain
} from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      console.log('Buscando por:', searchQuery);
      navigate(`/search?query=${searchQuery}`);
    }
  };

  return (
    <>
      <div className="navbar-spacer"></div>

      <nav className="navbar navbar-expand-lg fixed-top">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
            <FontAwesomeIcon
              icon={faBrain}
              className="logo-icon"
              style={{ fontSize: '1.8rem' }}
            />
            <h1 className="d-none d-lg-inline logo-text mb-0">
              Sabi<span className="brand-highlight">dus</span>
            </h1>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarContent">
            <form className="d-flex mx-auto search-form" onSubmit={handleSearchSubmit}>
              <div className={`input-group ${searchFocused ? 'focused' : ''}`}>
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faSearch} />
                </span>
                <input
                  type="search"
                  className="form-control"
                  placeholder="Buscar no Sabidus..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
              </div>
            </form>

            <div className="ms-auto d-flex align-items-center gap-3">
              {user ? (
                <>
                  <button className="btn btn-link text-dark position-relative notification-btn">
                    <FontAwesomeIcon icon={faBell} size="lg" />
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      2
                    </span>
                  </button>

                  <div className="dropdown" ref={menuRef}>
                    <button
                      className="btn btn-link text-dark p-0 d-flex align-items-center gap-2"
                      onClick={() => setShowUserMenu(!showUserMenu)}
                    >
                      <img
                        src={`https://ui-avatars.com/api/?name=${user.nome || 'User'}&background=random`}
                        alt="Avatar"
                        className="rounded-circle"
                        width="32"
                        height="32"
                      />
                      <span className="d-none d-lg-block">
                        {user.nome || user.email}
                      </span>
                    </button>

                    <div 
                      className={`dropdown-menu shadow ${showUserMenu ? 'show' : ''}`}
                      style={{ position: 'absolute', right: 0, top: '100%', zIndex: 1050 }}
                    >
                      <Link className="dropdown-item" to="/profile">
                        <FontAwesomeIcon icon={faUser} className="me-2" />
                        Perfil
                      </Link>
                      <Link className="dropdown-item" to="/settings">
                        <FontAwesomeIcon icon={faCog} className="me-2" />
                        Configurações
                      </Link>
                      <div className="dropdown-divider"></div>
                      <button 
                        className="dropdown-item text-danger" 
                        onClick={handleLogout}
                      >
                        <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                        Sair
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => navigate('/login')}
                  >
                    Login
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate('/register')}
                  >
                    Cadastre-se
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>


      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

          .navbar-spacer {
            height: 64px;
          }

          .navbar {
            height: 64px;
            font-family: 'Roboto', Arial, sans-serif;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(231, 231, 231, 0.8);
            padding: 0;
            z-index: 1040;
          }

          .navbar-brand {
            text-decoration: none;
          }

          .logo-icon {
            color: #3498DB;
            margin-bottom: 0.25rem;
          }

          .logo-text {
            font-family: 'Poppins', sans-serif;
            font-weight: 700;
            font-size: 1.5rem;
            color: #2C3E50;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin: 0;
          }

          .brand-highlight {
            color: #3498DB;
          }

          .search-form {
            width: 100%;
            max-width: 500px;
            margin: 0 2rem;
          }

          .input-group {
            transition: all 0.2s ease;
            border-radius: 25px;
            overflow: hidden;
            background: #f0f2f5;
            border: 1px solid transparent;
          }

          .input-group.focused {
            background: white;
            border-color: #3498DB;
            box-shadow: 0 0 0 4px rgba(52, 152, 219, 0.1);
          }

          .input-group-text {
            background: transparent;
            border: none;
            color: #6c757d;
            padding-left: 1.25rem;
          }

          .search-form .form-control {
            border: none;
            padding: 0.7rem 1rem;
            background: transparent;
            font-size: 0.95rem;
            height: 42px;
          }

          .search-form .form-control:focus {
            box-shadow: none;
          }

          .notification-btn {
            padding: 0.5rem;
            color: #6c757d !important;
            transition: color 0.2s ease;
          }

          .notification-btn:hover {
            color: #3498DB !important;
          }

          .btn-primary {
            background-color: #3498DB;
            border-color: #3498DB;
            padding: 0.5rem 1.25rem;
            border-radius: 20px;
            font-weight: 500;
            transition: all 0.2s ease;
          }

          .btn-primary:hover {
            background-color: #2980b9;
            border-color: #2980b9;
            transform: translateY(-1px);
          }

          .btn-outline-primary {
            color: #3498DB;
            border-color: #3498DB;
            padding: 0.5rem 1.25rem;
            border-radius: 20px;
            font-weight: 500;
            transition: all 0.2s ease;
          }

          .btn-outline-primary:hover {
            background-color: #3498DB;
            border-color: #3498DB;
            transform: translateY(-1px);
          }

          .dropdown {
            position: relative;
            z-index: 1050;
          }

          .dropdown-menu {
            margin-top: 0.75rem;
            border: none;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            min-width: 220px;
            z-index: 1050;
          }

          .dropdown-item {
            padding: 0.7rem 1.25rem;
            font-size: 0.95rem;
            transition: all 0.2s ease;
          }

          .dropdown-item:hover {
            background-color: #f8f9fa;
          }

          .dropdown-divider {
            margin: 0.5rem 0;
            border-top-color: #f1f1f1;
          }

          @media (max-width: 991.98px) {
            .navbar-spacer {
              height: 72px;
            }

            .navbar {
              height: auto;
              padding: 0.75rem 0;
            }

            .search-form {
              margin: 1rem 0;
              width: 100%;
              max-width: 100%;
            }

            #navbarContent {
              background: rgba(255, 255, 255, 0.95);
              backdrop-filter: blur(10px);
              padding: 1rem;
              border-radius: 0 0 1rem 1rem;
              border: 1px solid rgba(231, 231, 231, 0.8);
              border-top: none;
              margin: 0 -1rem;
            }

            .dropdown-menu {
              position: absolute !important;
              right: 0 !important;
              left: auto !important;
              transform: none !important;
            }
          }
        `}
      </style>
    </>
  );
};

export default Navbar;
