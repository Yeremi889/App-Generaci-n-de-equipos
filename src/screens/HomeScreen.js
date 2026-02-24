import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGroupNames, saveGroupData } from '../utils/storage';

function HomeScreen() {
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setGroups(getGroupNames());
  }, []);

  const handleCreateGroup = () => {
    if (newGroupName.trim() === '') return;
    // Creamos el grupo con listas vacías
    saveGroupData(newGroupName, { players: [], restrictions: [] });
    setGroups(getGroupNames());
    setNewGroupName('');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Mis Mejengas</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <input 
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          placeholder="Nombre del grupo (ej: Voley Lunes)"
          style={{ padding: '10px', width: '70%' }}
        />
        <button onClick={handleCreateGroup} style={{ padding: '10px' }}>Crear</button>
      </div>

      <div style={{ display: 'grid', gap: '10px' }}>
        {groups.map(group => (
          <div 
            key={group} 
            onClick={() => navigate(`/group/${group}`)}
            style={{ 
              padding: '20px', 
              border: '1px solid #ccc', 
              borderRadius: '8px', 
              cursor: 'pointer',
              backgroundColor: '#fff'
            }}
          >
            <h3>{group}</h3>
          </div>
        ))}
        {groups.length === 0 && <p>No hay grupos creados. ¡Crea el primero!</p>}
      </div>
    </div>
  );
}

export default HomeScreen;