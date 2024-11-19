import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';

const SearchBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  // Recupera buscas recentes do localStorage ao montar o componente
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Recupera query da URL ao montar
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('query');
    if (query) {
      setSearchQuery(query);
    }
  }, [location.search]);

  const addToRecentSearches = (query) => {
    const updated = [query, ...recentSearches.filter(item => item !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    
    if (trimmedQuery) {
      addToRecentSearches(trimmedQuery);
      navigate(`/search?query=${encodeURIComponent(trimmedQuery)}`);
      setSearchFocused(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
    navigate('/search');
  };

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <form onSubmit={handleSearchSubmit} className="w-full">
        <div className={`flex items-center relative rounded-full bg-gray-100 
          ${searchFocused ? 'ring-2 ring-blue-500 bg-white' : 'hover:bg-gray-200'}`}>
          <div className="flex items-center pl-4 text-gray-500">
            <Search size={20} />
          </div>
          
          <input
            type="search"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
            placeholder="Pesquisar..."
            className="w-full py-2 px-3 bg-transparent border-none focus:outline-none
              text-gray-900 placeholder-gray-500"
          />
          
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="px-3 py-2 text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          )}
        </div>
        
        {searchFocused && recentSearches.length > 0 && (
          <div className="absolute w-full mt-2 bg-white rounded-lg shadow-lg border 
            border-gray-200 z-50">
            <div className="py-2">
              <div className="px-4 py-2 text-sm font-medium text-gray-500">
                Buscas recentes
              </div>
              {recentSearches.map((query, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSearchQuery(query);
                    handleSearchSubmit({ preventDefault: () => {} });
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 
                    hover:bg-gray-100"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;