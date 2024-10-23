import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = ({ isLoggedIn, handleLogout }) => {
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white mb-4" style={{ border: 'none', boxShadow: 'none' }}>
      <div className="container-fluid">
        <a className="navbar-brand mx-auto" href="#">Minha Logo</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Formulário de Pesquisa */}
          <form className="d-flex mx-auto" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Pesquisar"
              aria-label="Pesquisar"
            />
            <button className="btn btn-primary" type="submit">Buscar</button>
          </form>
          <ul className="navbar-nav ms-auto">
            {!isLoggedIn && (
              <>
                <li className="nav-item">
                  <button className="btn btn-primary me-2" onClick={() => navigate('/login')}>Login</button>
                </li>
                <li className="nav-item">
                  <button className="btn btn-secondary me-2" onClick={() => navigate('/register')}>Registrar</button>
                </li>
              </>
            )}
            {isLoggedIn && (
              <li className="nav-item">
                <button className="btn btn-danger" onClick={handleLogout}>Sair</button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
