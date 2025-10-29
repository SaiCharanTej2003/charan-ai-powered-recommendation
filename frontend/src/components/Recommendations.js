// components/Recommendations.js
import React from "react";

const Recommendations = ({ recommendations = [], isLoading }) => {
  if (isLoading) {
    return <p>Loading recommendations...</p>;
  }

  if (!Array.isArray(recommendations) || recommendations.length === 0) {
    return (
      <div className="recommendations-container">
        <h3>Recommended Products</h3>
        <p>No recommendations yet.</p>
      </div>
    );
  }

  return (
    <div className="recommendations-container">
      <h3>Recommended Products</h3>
      <div className="recommendations-grid">
        {recommendations.map((rec, index) => {
          const product = rec.product || {}; // safely access nested fields
          return (
            <div key={product.id || index} className="recommendation-card">
              <h4>{product.name}</h4>
              <p>
                ₹{product.price} • {product.brand} • {product.category}
              </p>
              {rec.explanation && (
                <p className="recommendation-explanation">
                  {rec.explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Recommendations;
