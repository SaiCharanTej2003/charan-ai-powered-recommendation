// components/Catalog.js
import React, { useEffect, useState } from "react";
import { fetchProducts } from "../services/api";
import "./catalog.css";

const Catalog = ({ onProductClick, browsingHistory = [] }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products initially
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data || []);
        setFilteredProducts(data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  // Function to apply filters based on localStorage
  const applyFilters = () => {
    const prefs = JSON.parse(localStorage.getItem("userPreferences")) || {};
    const { priceRange, categories, brands } = prefs;

    let updated = [...products];

    if (categories?.length) {
      updated = updated.filter((p) => categories.includes(p.category));
    }

    if (brands?.length) {
      updated = updated.filter((p) => brands.includes(p.brand));
    }

    if (priceRange) {
      updated = updated.filter((p) => {
        if (priceRange === "low") return p.price < 50;
        if (priceRange === "medium") return p.price >= 50 && p.price <= 100;
        if (priceRange === "high") return p.price > 100;
        return true;
      });
    }

    setFilteredProducts(updated);
  };

  // Listen for preference updates
  useEffect(() => {
    window.addEventListener("preferencesUpdated", applyFilters);
    return () => window.removeEventListener("preferencesUpdated", applyFilters);
  }, [products]);

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="catalog-container">
      {filteredProducts.map((product) => {
        const isViewed = browsingHistory.includes(product.id);
        return (
          <div
            key={product.id}
            className={`product-card ${isViewed ? "viewed" : ""}`}
            onClick={() => onProductClick && onProductClick(product.id)}
          >
            <div className="product-info">
              <h4>{product.name}</h4>
              <p>
                ${product.price} • {product.brand} • {product.category}
              </p>
            </div>
            {isViewed && <span className="viewed-badge">Viewed</span>}
          </div>
        );
      })}
    </div>
  );
};

export default Catalog;
