import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGroupDetails, saveGroupData } from '../utils/storage';

function GroupDetailScreen() {
  const { groupName } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({ players: [], restrictions: [] });
  const [numTeams, setNumTeams] = useState(2);
  const [showPlayerForm, setShowPlayerForm] = useState(false);
  const [showRestrictions, setShowRestrictions] = useState(false);
  
  // NUEVO: Estado para manejar los jugadores seleccionados para jugar hoy
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  
  const POSICIONES = ["Punta", "Centro", "Colocador"];

  const [newPlayer, setNewPlayer] = useState({
    nombre: '', genero: 'M', posicionPrincipal: 'Punta', posicionesSecundarias: [],
    ataque: 5, bloqueo: 5, saque: 5, recepcion: 5, colocacion: 5, maleta: 5
  });

  const [newRestriction, setNewRestriction] = useState({
    jugadorA: '', jugadorB: '', tipo: 'nocon', prioridad: 2, comentario: ''
  });

  useEffect(() => {
    setData(getGroupDetails(groupName));
  }, [groupName]);

  const handleSaveData = (updatedData) => {
    setData(updatedData);
    saveGroupData(groupName, updatedData);
  };

  // Función para seleccionar/deseleccionar
  const togglePlayerSelection = (playerId) => {
    if (selectedPlayers.includes(playerId)) {
      setSelectedPlayers(selectedPlayers.filter(id => id !== playerId));
    } else {
      // Opcional: Impedir seleccionar más de lo necesario
      if (selectedPlayers.length < numTeams * 6) {
        setSelectedPlayers([...selectedPlayers, playerId]);
      }
    }
  };

  const handleGoToGenerate = () => {
    // Solo enviamos los jugadores que fueron seleccionados
    const playersToPlay = data.players.filter(p => selectedPlayers.includes(p.id));
    navigate('/generate', { 
      state: { 
        players: playersToPlay, 
        restrictions: data.restrictions || [], 
        numTeams: numTeams 
      } 
    });
  };

  const handleSavePlayer = () => {
    if (!newPlayer.nombre) return;
    const promedio = (newPlayer.ataque + newPlayer.bloqueo + newPlayer.saque + newPlayer.recepcion + newPlayer.colocacion + newPlayer.maleta) / 6;
    const updatedData = { 
      ...data, 
      players: [...data.players, { ...newPlayer, id: Date.now().toString(), promedio: promedio.toFixed(2) }] 
    };
    handleSaveData(updatedData);
    setShowPlayerForm(false);
    resetPlayerForm();
  };

  const handleDeletePlayer = (id) => {
    const updatedData = { ...data, players: data.players.filter(p => p.id !== id) };
    setSelectedPlayers(selectedPlayers.filter(sid => sid !== id));
    handleSaveData(updatedData);
  };

  const resetPlayerForm = () => {
    setNewPlayer({ nombre: '', genero: 'M', posicionPrincipal: 'Punta', posicionesSecundarias: [], ataque: 5, bloqueo: 5, saque: 5, recepcion: 5, colocacion: 5, maleta: 5 });
  };

  const toggleSecundaria = (pos) => {
    if (newPlayer.posicionPrincipal === pos) return;
    const actual = newPlayer.posicionesSecundarias || [];
    const nueva = actual.includes(pos) ? actual.filter(p => p !== pos) : [...actual, pos];
    setNewPlayer({...newPlayer, posicionesSecundarias: nueva});
  };

  const handleSaveRestriction = () => {
    if (!newRestriction.jugadorA || !newRestriction.jugadorB || newRestriction.jugadorA === newRestriction.jugadorB) {
      alert("Selecciona dos jugadores diferentes");
      return;
    }
    const updatedData = { 
      ...data, 
      restrictions: [...(data.restrictions || []), { ...newRestriction, id: Date.now().toString() }] 
    };
    handleSaveData(updatedData);
    setNewRestriction({ jugadorA: '', jugadorB: '', tipo: 'nocon', prioridad: 2, comentario: '' });
  };

  const deleteRestriction = (id) => {
    const updatedData = { ...data, restrictions: data.restrictions.filter(r => r.id !== id) };
    handleSaveData(updatedData);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <button onClick={() => navigate('/')} style={{ marginBottom: '10px' }}>← Mis Mejengas</button>
      <h2 style={{ margin: '10px 0' }}>{groupName}</h2>

      <div style={{ background: '#e9ecef', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <label style={{ fontWeight: 'bold' }}>Equipos a formar: </label>
        <select value={numTeams} onChange={(e) => { setNumTeams(parseInt(e.target.value)); setSelectedPlayers([]); }} style={{ padding: '5px' }}>
          {[2, 3, 4].map(n => <option key={n} value={n}>{n} Equipos ({(n*6)} jugadores)</option>)}
        </select>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => setShowPlayerForm(true)} style={{ flex: 1, padding: '12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>+ Nuevo Jugador</button>
        <button onClick={() => setShowRestrictions(true)} style={{ flex: 1, padding: '12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Restricciones</button>
      </div>

      {/* FORMULARIO DE JUGADOR (Mismo código original) */}
      {showPlayerForm && (
        <div style={{ background: 'white', padding: '20px', border: '1px solid #ddd', borderRadius: '10px', marginBottom: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0 }}>Registro de Jugador</h3>
          <input placeholder="Nombre Completo" value={newPlayer.nombre} onChange={e => setNewPlayer({...newPlayer, nombre: e.target.value})} style={{ width: '98%', padding: '10px', marginBottom: '15px' }} />
          
          <div style={{ marginBottom: '15px' }}>
            <label>Género: </label>
            <select value={newPlayer.genero} onChange={e => setNewPlayer({...newPlayer, genero: e.target.value})}>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>Posición Principal:</label>
            {POSICIONES.map(pos => (
              <label key={pos} style={{ marginRight: '10px' }}>
                <input type="radio" name="principal" checked={newPlayer.posicionPrincipal === pos} onChange={() => setNewPlayer({...newPlayer, posicionPrincipal: pos, posicionesSecundarias: (newPlayer.posicionesSecundarias || []).filter(p => p !== pos)})} /> {pos}
              </label>
            ))}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>Posiciones Secundarias:</label>
            {POSICIONES.map(pos => (
              <label key={pos} style={{ marginRight: '10px', color: newPlayer.posicionPrincipal === pos ? '#ccc' : 'black' }}>
                <input type="checkbox" disabled={newPlayer.posicionPrincipal === pos} checked={(newPlayer.posicionesSecundarias || []).includes(pos)} onChange={() => toggleSecundaria(pos)} /> {pos}
              </label>
            ))}
          </div>

          <hr />
          {['ataque', 'bloqueo', 'saque', 'recepcion', 'colocacion', 'maleta'].map(stat => (
            <div key={stat} style={{ margin: '10px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label style={{ textTransform: 'capitalize' }}>{stat}:</label>
                <span style={{ fontWeight: 'bold', color: '#007bff' }}>{newPlayer[stat]}</span>
              </div>
              <input type="range" min="1" max="10" value={newPlayer[stat]} onChange={e => setNewPlayer({...newPlayer, [stat]: parseInt(e.target.value)})} style={{ width: '100%' }} />
            </div>
          ))}

          <button onClick={handleSavePlayer} style={{ marginTop: '15px', width: '100%', padding: '12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>GUARDAR JUGADOR</button>
          <button onClick={() => setShowPlayerForm(false)} style={{ marginTop: '10px', width: '100%', background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer' }}>Cancelar</button>
        </div>
      )}

      {/* MODAL DE RESTRICCIONES (Mismo código original) */}
      {showRestrictions && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', width: '90%', maxWidth: '500px', maxHeight: '80%', overflowY: 'auto', padding: '20px', borderRadius: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', marginBottom: '15px' }}>
              <h3 style={{ margin: 0 }}>Restricciones del Grupo</h3>
              <button onClick={() => setShowRestrictions(false)} style={{ border: 'none', background: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
            </div>

            <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
              <p style={{marginTop: 0, fontWeight: 'bold'}}>Nueva Restricción:</p>
              <select style={{width:'100%', padding:'8px', marginBottom:'10px'}} value={newRestriction.jugadorA} onChange={e => setNewRestriction({...newRestriction, jugadorA: e.target.value})}>
                <option value="">Seleccionar Jugador 1...</option>
                {data.players.map(p => <option key={p.id} value={p.nombre}>{p.nombre}</option>)}
              </select>
              <select style={{width:'100%', padding:'8px', marginBottom:'10px'}} value={newRestriction.jugadorB} onChange={e => setNewRestriction({...newRestriction, jugadorB: e.target.value})}>
                <option value="">Seleccionar Jugador 2...</option>
                {data.players.map(p => <option key={p.id} value={p.nombre}>{p.nombre}</option>)}
              </select>
              <div style={{marginBottom: '10px'}}>
                <label>Prioridad: </label>
                <select value={newRestriction.prioridad} onChange={e => setNewRestriction({...newRestriction, prioridad: parseInt(e.target.value)})}>
                  <option value={1}>1 (Baja)</option>
                  <option value={2}>2 (Media)</option>
                  <option value={3}>3 (Obligatoria)</option>
                </select>
              </div>
              <textarea placeholder="Comentario" value={newRestriction.comentario} onChange={e => setNewRestriction({...newRestriction, comentario: e.target.value})} style={{width:'96%', height: '50px', padding: '5px'}} />
              <button onClick={handleSaveRestriction} style={{ width: '100%', padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', marginTop: '10px', cursor: 'pointer' }}>Agregar</button>
            </div>

            <h4>Lista de Restricciones</h4>
            {data.restrictions?.length > 0 ? data.restrictions.map(r => (
              <div key={r.id} style={{ borderBottom: '1px solid #eee', padding: '10px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{fontSize: '14px'}}>
                  <strong>{r.jugadorA}</strong> ↔ <strong>{r.jugadorB}</strong>
                  <div style={{ color: '#666', fontSize: '12px' }}>Prio: {r.prioridad} {r.comentario && `| ${r.comentario}`}</div>
                </div>
                <button onClick={() => deleteRestriction(r.id)} style={{ color: '#ff4d4d', border: 'none', background: 'none', cursor: 'pointer' }}>Borrar</button>
              </div>
            )) : <p style={{fontSize: '14px', color: '#999'}}>No hay restricciones aún.</p>}
          </div>
        </div>
      )}

      {/* LISTA DE JUGADORES CON SELECCIÓN */}
      <h3>Selecciona a los convocados ({selectedPlayers.length} / {numTeams * 6})</h3>
      <p style={{fontSize: '12px', color: '#666', marginTop: '-10px'}}>Toca el nombre de los que vinieron hoy.</p>
      
      <div style={{ display: 'grid', gap: '10px' }}>
        {data.players.map(p => {
          const isSelected = selectedPlayers.includes(p.id);
          return (
            <div 
              key={p.id} 
              onClick={() => togglePlayerSelection(p.id)}
              style={{ 
                padding: '15px', 
                background: isSelected ? '#e3f2fd' : 'white', 
                border: isSelected ? '2px solid #2196f3' : '1px solid #eee', 
                borderRadius: '8px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <div>
                <div style={{ fontWeight: 'bold' }}>
                  {isSelected && '✅ '}
                  {p.nombre} <span style={{ color: '#666', fontWeight: 'normal' }}>({p.genero})</span>
                </div>
                <div style={{ fontSize: '12px', color: '#007bff' }}>
                  {p.posicionPrincipal} {(p.posicionesSecundarias || []).length > 0 ? ` | Sec: ${p.posicionesSecundarias.join(', ')}` : ''}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Prom: {p.promedio}</div>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDeletePlayer(p.id); }} 
                  style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '12px', padding: '5px' }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* BOTÓN DE GENERAR (Solo activo si hay exactamente el número necesario) */}
      {selectedPlayers.length === (numTeams * 6) ? (
        <button 
          onClick={handleGoToGenerate}
          style={{ width: '100%', padding: '18px', background: '#fd7e14', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', marginTop: '30px', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
        >
          GENERAR {numTeams} EQUIPOS EQUILIBRADOS
        </button>
      ) : (
        <div style={{ marginTop: '30px', padding: '15px', textAlign: 'center', background: '#fff3cd', borderRadius: '8px', color: '#856404', fontSize: '14px' }}>
          {selectedPlayers.length < (numTeams * 6) 
            ? `Selecciona ${ (numTeams * 6) - selectedPlayers.length } jugadores más.` 
            : `Has seleccionado demasiados. Quita ${ selectedPlayers.length - (numTeams * 6) }.`
          }
        </div>
      )}
    </div>
  );
}

export default GroupDetailScreen;