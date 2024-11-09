import React from 'react';

const SearchBar = ({ searchQuery, setSearchQuery, placeholder }) => {
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder={placeholder || "Search..."}
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-input"
      />
    </div>
  );
};

export default SearchBar;
