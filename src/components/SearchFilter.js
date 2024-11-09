import React from 'react';

const SearchFilter = ({ category, searchQuery, onSearchChange, onCategoryChange }) => {
  return (
    <div className="search-filter">
      <input
        type="text"
        placeholder="Search by name, email, or phone..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)} // Update search query
        className="search-input"
      />

      <select value={category} onChange={onCategoryChange}>
        <option value="All">All</option>
        <option value="Friends">Friends</option>
        <option value="Office">Office</option>
        <option value="Family">Family</option>
      </select>
    </div>
  );
};

export default SearchFilter;
