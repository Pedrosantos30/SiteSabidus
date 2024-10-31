// src/components/ActivitySummary.js
import React from 'react';
import { useAuth } from '../context/AuthContext';

const ActivitySummary = ({ posts, userVotes }) => {
  const { user } = useAuth();

  if (!user) return null; // Não renderiza se o usuário não estiver logado

  return (
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
  );
};

export default ActivitySummary;
