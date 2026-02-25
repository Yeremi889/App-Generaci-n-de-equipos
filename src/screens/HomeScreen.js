// src/screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGroups, createGroup, deleteGroup } from '../utils/storage';
import SearchBar from '../components/SearchBar'; // El nuevo componente

function HomeScreen() {
  const [groups, setGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newGroupName, setNewGroupName] = useState('');
  const navigate = useNavigate();

  // Cargar grupos al iniciar
  useEffect(() => {
    setGroups(getGroups());
  }, []);

  const handleCreate = () => {
    if (!newGroupName.trim()) return;
    createGroup(newGroupName.trim());
    setGroups(getGroups());
    setNewGroupName('');
  };

  const handleDelete = (name, e) => {
    e.stopPropagation(); // Evita que al borrar se abra el grupo
    if (window.confirm(`¿Seguro que quieres borrar "${name}"?`)) {
      deleteGroup(name);
      setGroups(getGroups());
    }
  };

  // Lógica de filtrado para el SearchBar
  const filteredGroups = groups.filter(g => 
    g.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="screen-content fade-in">
      <header style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#222' }}>
          Mis <span style={{ color: '#fd7e14' }}>Mejengas</span>
        </h1>
        <p style={{ color: '#666', fontSize: '14px' }}>Organiza tus grupos de voley</p>
      </header>

      {/* Barra de búsqueda con el diseño que hicimos */}
      <SearchBar 
        value={searchTerm} 
        onChange={setSearchTerm} 
        placeholder="Buscar grupo..." 
      />

      {/* Formulario para crear nuevo grupo (Integrado elegantemente) */}
      <div className="card" style={{ border: '2px dashed #ddd', background: '#fcfcfc' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="Ej: Mejenga de los Jueves"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            style={{ 
                flex: 1, 
                border: '1px solid #ddd', 
                borderRadius: '8px', 
                padding: '10px',
                outline: 'none'
            }}
          />
          <button 
            onClick={handleCreate}
            style={{ 
                background: '#333', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px', 
                padding: '0 15px',
                fontWeight: 'bold'
            }}
          >
            +
          </button>
        </div>
      </div>

      {/* Lista de Grupos */}
      <div style={{ marginTop: '20px' }}>
        {filteredGroups.length > 0 ? (
          filteredGroups.map((group) => (
            <div 
              key={group} 
              className="card fade-in" 
              onClick={() => navigate(`/group/${group}`)}
              style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  cursor: 'pointer'
              }}
            >
              <div>
                <span style={{ fontSize: '20px', marginRight: '10px' }}>🏐</span>
                <strong style={{ fontSize: '17px' }}>{group}</strong>
              </div>
              <button 
                onClick={(e) => handleDelete(group, e)}
                style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: '#ff4d4d', 
                    fontSize: '18px',
                    cursor: 'pointer'
                }}
              >
                🗑️
              </button>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', color: '#999', marginTop: '40px' }}>
            {searchTerm ? "No se encontraron grupos..." : "Crea tu primer grupo arriba"}
          </p>
        )}
      </div>
    </div>
  );
}

export default HomeScreen;