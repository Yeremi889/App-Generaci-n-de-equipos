import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { POSICIONES } from '../utils/constants';
import { saveGroupData, getGroupDetails } from '../utils/storage';

function PlayerFormScreen() {
    const { groupName } = useParams();
    const navigate = useNavigate();
    const [player, setPlayer] = useState({
        nombre: '',
        posicionPrincipal: 'Punta',
        posicionesSecundarias: [],
        stats: { ataque: 5, bloqueo: 5, saque: 5, recepcion: 5, colocacion: 5, maleta: 5 }
    });

    const toggleSecondary = (pos) => {
        if (pos === player.posicionPrincipal) return;
        setPlayer(prev => ({
            ...prev,
            posicionesSecundarias: prev.posicionesSecundarias.includes(pos)
                ? prev.posicionesSecundarias.filter(p => p !== pos)
                : [...prev.posicionesSecundarias, pos]
        }));
    };

    const handleSave = () => {
        // 1. Limpiamos espacios en blanco
        const nombreLimpio = player.nombre.trim();

        // 2. Validación de campo vacío
        if (!nombreLimpio) {
        return alert("¡El nombre es obligatorio, crack!");
        }

        // 3. Obtener datos actuales del grupo
        const data = getGroupDetails(groupName);

        // 4. VALIDACIÓN DE DUPLICADOS (Ignorando mayúsculas/minúsculas)
        const nombreExiste = data.players.some(
        (p) => p.nombre.toLowerCase() === nombreLimpio.toLowerCase()
        );

        if (nombreExiste) {
        return alert(`¡Ojo! Ya existe un jugador llamado "${nombreLimpio}" en este grupo. Prueba añadiendo un apellido o un apodo.`);
        }

        // 5. Si todo está bien, calculamos promedio y guardamos
        const values = Object.values(player.stats);
        const promedio = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);
        
        const newPlayer = { 
            ...player, 
            nombre: nombreLimpio, // Guardamos el nombre ya sin espacios
            id: Date.now().toString(), 
            promedio 
    };

    saveGroupData(groupName, { ...data, players: [...data.players, newPlayer] });
    navigate(-1);
  };

    return (
        <div className="screen-content fade-in">
            <header style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
                <button onClick={() => navigate(-1)} className="back-link">← Cancelar</button>
                <h2 style={{margin:0}}>Ficha de Atleta</h2>
            </header>

            <div className="card shadow-sm">
                <label className="text-muted">Nombre</label>
                <input className="main-input" value={player.nombre} onChange={e => setPlayer({...player, nombre: e.target.value})} placeholder="Nombre del jugador" />

                <label className="text-muted">Posición Principal</label>
                <select className="main-input" value={player.posicionPrincipal} onChange={e => setPlayer({...player, posicionPrincipal: e.target.value, posicionesSecundarias: []})}>
                    {POSICIONES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>

                <label className="text-muted">Posiciones Secundarias</label>
                <div className="chip-container">
                    {POSICIONES.map(pos => (
                        <button 
                            key={pos} 
                            className={`chip ${player.posicionesSecundarias.includes(pos) ? 'active' : ''} ${player.posicionPrincipal === pos ? 'disabled' : ''}`}
                            onClick={() => toggleSecondary(pos)}
                            disabled={player.posicionPrincipal === pos}
                        >
                            {pos}
                        </button>
                    ))}
                </div>
            </div>

            <h3 className="section-title">Habilidades (Stats)</h3>
            <div className="card">
                {Object.keys(player.stats).map(stat => (
                    <div key={stat} className="stat-row">
                        <div className="stat-info">
                            <span className="stat-label">{stat.toUpperCase()}</span>
                            <span className="stat-numb" style={{color: player.stats[stat] > 7 ? '#51cf66' : player.stats[stat] < 4 ? '#ff4d4d' : '#fd7e14'}}>{player.stats[stat]}</span>
                        </div>
                        <input type="range" min="1" max="10" className={`skill-slider level-${player.stats[stat]}`} value={player.stats[stat]} onChange={(e) => setPlayer({...player, stats: {...player.stats, [stat]: parseInt(e.target.value)}})} />
                    </div>
                ))}
            </div>
            <button onClick={handleSave} className="btn-orange shadow-lg" style={{marginTop: '20px'}}>GUARDAR JUGADOR</button>
        </div>
    );
}
export default PlayerFormScreen;