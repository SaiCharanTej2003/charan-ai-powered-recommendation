// components/BrowsingHistory.js
import React from "react";
import "./BrowsingHistory.css";

const BrowsingHistory = ({ history = [], products = [], onClearHistory }) => {
  const viewedProducts = products.filter((p) => history.includes(p.id));

  return (
    <div className="browsing-history">
      <h3>Browsing History</h3>

      {viewedProducts.length === 0 ? (
        <p>No items viewed yet.</p>
      ) : (
        <>
          <ul className="history-list">
            {viewedProducts.map((product) => (
              <li key={product.id} className="history-item">
                <div>
                  <strong>{product.name}</strong>
                  <p>
                    {product.brand} • {product.category} • ${product.price}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <button className="clear-history" onClick={onClearHistory}>
            Clear History
          </button>
        </>
      )}
    </div>
  );
};

export default BrowsingHistory;
