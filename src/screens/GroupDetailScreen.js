import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGroupDetails, saveGroupData } from '../utils/storage';
import SearchBar from '../components/SearchBar';
import PlayerCard from '../components/PlayerCard';

function GroupDetailScreen() {
  const { groupName } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({ players: [], restrictions: [] });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [numTeams, setNumTeams] = useState(2);

  // Carga inicial de datos
  useEffect(() => {
    const groupData = getGroupDetails(groupName);
    setData(groupData);
  }, [groupName]);

  // Selección/Deselección de jugadores
  const togglePlayer = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  // Eliminar un jugador del grupo
  const handleDeletePlayer = (id, e) => {
    e.stopPropagation();
    if (window.confirm("¿Estás seguro de que quieres eliminar a este jugador?")) {
      const updatedPlayers = data.players.filter(p => p.id !== id);
      const updatedData = { ...data, players: updatedPlayers };
      
      saveGroupData(groupName, updatedData);
      setData(updatedData);
      
      // Si el jugador estaba seleccionado, se quita de la lista de selección
      setSelectedIds(prev => prev.filter(pId => pId !== id));
    }
  };

  // Filtrado por búsqueda
  const filteredPlayers = data.players.filter(p => 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerate = () => {
    const selectedPlayers = data.players.filter(p => selectedIds.includes(p.id));
    navigate('/generate', { 
      state: { 
        players: selectedPlayers, 
        restrictions: data.restrictions, 
        numTeams 
      } 
    });
  };

  const requiredPlayers = numTeams * 6;

  return (
    <div className="screen-content fade-in">
      {/* Cabecera Principal */}
      <header className="header-main">
        <button onClick={() => navigate('/')} className="back-link">← Mis Grupos</button>
        <div className="title-row">
          <h1 style={{ margin: 0, fontSize: '28px' }}>{groupName}</h1>
          <div style={{ display: 'flex', gap: '10px' }}>
            {/* Botón de Restricciones (🚫) */}
            <button 
              onClick={() => navigate(`/restrictions/${groupName}`)}
              className="btn-add-plus"
              style={{ background: '#eee', color: '#333', fontSize: '18px' }}
              title="Restricciones"
            >
              🚫
            </button>
            {/* Botón de Añadir Jugador (+) */}
            <button 
              onClick={() => navigate(`/add-player/${groupName}`)}
              className="btn-add-plus"
              title="Añadir Jugador"
            >
              +
            </button>
          </div>
        </div>
      </header>

      {/* Selector de Equipos (Modo Oscuro) */}
      <div className="card-dark">
        <div className="selector-flex">
          <span style={{ fontWeight: 'bold' }}>Armar para:</span>
          <div className="teams-toggle">
            <button 
              className={numTeams === 2 ? 'active' : ''} 
              onClick={() => setNumTeams(2)}
            >
              12 Jug (2 eq)
            </button>
            <button 
              className={numTeams === 3 ? 'active' : ''} 
              onClick={() => setNumTeams(3)}
            >
              18 Jug (3 eq)
            </button>
          </div>
        </div>
      </div>

      <SearchBar 
        value={searchTerm} 
        onChange={setSearchTerm} 
        placeholder="Buscar jugador..." 
      />

      {/* Estado de seleccion */}
      <div style={{ marginBottom: '15px', padding: '0 5px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="text-muted">Jugadores seleccionados:</span>
          <span className={`player-avg-bubble ${selectedIds.length === requiredPlayers ? 'pulse' : ''}`} 
                style={{ background: selectedIds.length === requiredPlayers ? '#51cf66' : '#f0f4ff', 
                         color: selectedIds.length === requiredPlayers ? 'white' : '#007bff' }}>
            {selectedIds.length} / {requiredPlayers}
          </span>
        </div>
      </div>

      {/* Lista de Jugadores*/}
      <div style={{ paddingBottom: '100px' }}>
        {filteredPlayers.length > 0 ? (
          filteredPlayers.map(player => (
            <PlayerCard 
              key={player.id}
              player={player}
              isSelected={selectedIds.includes(player.id)}
              onToggle={() => togglePlayer(player.id)}
              onDelete={(e) => handleDeletePlayer(player.id, e)}
            />
          ))
        ) : (
          <p style={{ textAlign: 'center', color: '#999', marginTop: '40px' }}>
            {searchTerm ? "No se encontraron jugadores" : "Añade jugadores para empezar"}
          </p>
        )}
      </div>

      {/* Botón de Acción Flotante */}
      {selectedIds.length === requiredPlayers && (
        <div className="floating-btn-area">
          <button className="btn-orange shadow-lg pulse" onClick={handleGenerate}>
            ¡ARMAR EQUIPOS!
          </button>
        </div>
      )}
    </div>
  );
}

export default GroupDetailScreen;