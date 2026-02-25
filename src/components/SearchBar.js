// src/components/SearchBar.js
import React from 'react';

function SearchBar({ value, onChange, placeholder }) {
  return (
    <div style={{ marginBottom: '20px', position: 'relative' }}>
      <input
        type="text"
        placeholder={placeholder || "Buscar..."}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '12px 15px',
          borderRadius: '10px',
          border: '2px solid #eee',
          fontSize: '15px',
          outline: 'none',
          transition: 'border-color 0.2s'
        }}
        onFocus={(e) => e.target.style.borderColor = '#fd7e14'}
        onBlur={(e) => e.target.style.borderColor = '#eee'}
      />
      <span style={{ position: 'absolute', right: '15px', top: '12px', opacity: 0.3 }}>
        🔍
      </span>
    </div>
  );
}

export default SearchBar;