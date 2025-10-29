// components/UserPreferences.js
import React, { useState, useEffect } from "react";
import "./UserPreferences.css";

const UserPreferences = () => {
  const [priceRange, setPriceRange] = useState("all");
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // Load saved preferences when page loads
  useEffect(() => {
    const savedPrefs = JSON.parse(localStorage.getItem("userPreferences"));
    if (savedPrefs) {
      setPriceRange(savedPrefs.priceRange || "all");
      setCategories(savedPrefs.categories || []);
      setBrands(savedPrefs.brands || []);
    }
  }, []);

  // Save preferences to localStorage + trigger catalog update
  useEffect(() => {
    const prefs = { priceRange, categories, brands };
    localStorage.setItem("userPreferences", JSON.stringify(prefs));
    window.dispatchEvent(new Event("preferencesUpdated")); // notify Catalog
  }, [priceRange, categories, brands]);

  const handleCheckboxChange = (value, list, setter) => {
    setter(
      list.includes(value)
        ? list.filter((v) => v !== value)
        : [...list, value]
    );
  };

  return (
    <div className="preferences-form">
      <h3>User Preferences</h3>

      <label>Price Range:</label>
      <select
        value={priceRange}
        onChange={(e) => setPriceRange(e.target.value)}
        className="dropdown"
      >
        <option value="all">All</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <label>Categories:</label>
      <div className="checkbox-group">
        {["Sports", "Electronics", "Home"].map((cat) => (
          <label key={cat} className="checkbox-item">
            <input
              type="checkbox"
              checked={categories.includes(cat)}
              onChange={() => handleCheckboxChange(cat, categories, setCategories)}
            />
            {cat}
          </label>
        ))}
      </div>

      <label>Brands:</label>
      <div className="checkbox-group">
        {["Nike", "Adidas", "Puma"].map((brand) => (
          <label key={brand} className="checkbox-item">
            <input
              type="checkbox"
              checked={brands.includes(brand)}
              onChange={() => handleCheckboxChange(brand, brands, setBrands)}
            />
            {brand}
          </label>
        ))}
      </div>
    </div>
  );
};

export default UserPreferences;
