import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { POSICIONES } from '../utils/constants';
import { saveGroupData, getGroupDetails } from '../utils/storage';

function PlayerFormScreen() {
    const { groupName } = useParams();
    const navigate = useNavigate();
    
    // 1. Estado actualizado con el campo 'genero'
    const [player, setPlayer] = useState({
        nombre: '',
        genero: 'MASCULINO', // Valor inicial por defecto
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
        const nombreLimpio = player.nombre.trim();
        if (!nombreLimpio) return alert("Olvidaste ponerle un nombre a la maleta");

        const data = getGroupDetails(groupName);
        const nombreExiste = data.players.some(
            (p) => p.nombre.toLowerCase() === nombreLimpio.toLowerCase()
        );

        if (nombreExiste) {
            return alert(`Ya existe un jugador llamado "${nombreLimpio}" en el grupo.`);
        }

        const statsKeys = Object.keys(player.stats);
        const sumaPuntos = statsKeys.reduce((acc, key) => {
            if (key === 'maleta') {
                // Mantenemos la lógica de inversión: 10 maleta suma 1 al promedio
                return acc + (11 - player.stats[key]);
            }
            return acc + player.stats[key];
        }, 0);

        const promedio = (sumaPuntos / statsKeys.length).toFixed(2);
        
        const newPlayer = { 
            ...player, 
            nombre: nombreLimpio,
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

                {/* 2. Nuevo Selector de Género */}
                <label className="text-muted">Género</label>
                <div className="chip-container" style={{marginBottom: '20px'}}>
                    {['MASCULINO', 'FEMENINO'].map(g => (
                        <button 
                            key={g} 
                            className={`chip ${player.genero === g ? 'active' : ''}`}
                            onClick={() => setPlayer({...player, genero: g})}
                        >
                            {g}
                        </button>
                    ))}
                </div>

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
                {Object.keys(player.stats).map(stat => {
                    const val = player.stats[stat];
                    const isMaleta = stat === 'maleta';
                    
                    const colorStat = isMaleta
                        ? (val > 7 ? '#ff4d4d' : val < 4 ? '#51cf66' : '#fd7e14')
                        : (val > 7 ? '#51cf66' : val < 4 ? '#ff4d4d' : '#fd7e14');

                    return (
                        <div key={stat} className="stat-row">
                            <div className="stat-info">
                                <span className="stat-label">{stat.toUpperCase()} {isMaleta && "(INVERSA)"}</span>
                                <span className="stat-numb" style={{color: colorStat}}>{val}</span>
                            </div>
                            <input 
                                type="range" 
                                min="1" max="10" 
                                className={`skill-slider level-${val} ${isMaleta ? 'maleta-slider' : ''}`} 
                                value={val} 
                                onChange={(e) => setPlayer({...player, stats: {...player.stats, [stat]: parseInt(e.target.value)}})} 
                            />
                        </div>
                    );
                })}
            </div>
            <button onClick={handleSave} className="btn-orange shadow-lg" style={{marginTop: '20px'}}>GUARDAR JUGADOR</button>
        </div>
    );
}
export default PlayerFormScreen;