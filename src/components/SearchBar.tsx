import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder }) => {
  return (
    <div className="startrit-searchbar-wrapper" style={{ marginBottom: 16 }}>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'Search...'}
        className="startrit-searchbar-input"
        style={{
          width: '100%',
          padding: '10px 14px 10px 40px',
          borderRadius: 24,
          border: '1px solid #ccc',
          fontSize: 16,
          outline: 'none',
          background: `url("data:image/svg+xml,%3csvg fill='gray' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3e%3cpath d='M10 2a8 8 0 105.293 14.293l4.707 4.707 1.414-1.414-4.707-4.707A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z'/%3e%3c/svg%3e") no-repeat 12px center`,
          backgroundSize: 18,
        }}
      />
    </div>
  );
};

export default SearchBar;
