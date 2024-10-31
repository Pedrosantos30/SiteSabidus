// src/components/TrendingTopics.js

import React from 'react';

const TrendingTopics = () => {
  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body">
        <h5 className="card-title h6 mb-3">Trending Topics</h5>
        <div className="d-flex flex-wrap gap-2">
          {['#Tecnologia', '#Inovação', '#Ciência', '#Saúde', '#Educação'].map(tag => (
            <span key={tag} className="badge bg-primary">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingTopics;
