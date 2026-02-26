import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { generateTeams } from '../utils/algorithm';

function GenerateTeamsScreen() {
    const location = useLocation();
    const navigate = useNavigate();
    const [seed, setSeed] = useState(0);
    
    const { players, restrictions, numTeams } = location.state || { players: [], restrictions: [], numTeams: 2 };

    const equipos = useMemo(() => {
        if (!players || players.length === 0) return null;
        return generateTeams(players, restrictions, parseInt(numTeams));
    }, [players, restrictions, numTeams, seed]);

    if (!equipos) return (
        <div className="screen-content">
            <button onClick={() => navigate(-1)} className="back-link">← Volver</button>
            <p style={{marginTop: '20px'}}>Error en la configuración de equipos.</p>
        </div>
    );

    return (
        <div className="screen-content fade-in" style={{ paddingBottom: '40px' }}>
            <header className="header-main">
                <button onClick={() => navigate(-1)} className="back-link">← Volver</button>
                <h1 style={{ marginTop: '10px' }}>Equipos <span style={{ color: '#fd7e14' }}>Generados</span></h1>
            </header>

            <div className="teams-grid">
                {equipos.map((eq, idx) => (
                    <div key={idx} className="card shadow-sm" style={{ borderTop: '6px solid #fd7e14', marginBottom: '25px' }}>
                        <h2 style={{ color: '#fd7e14', margin: '0 0 15px 0', fontSize: '18px' }}>{eq.name}</h2>
                        {eq.members.map((player) => (
                            <div key={player.id} className="player-card-modern" style={{ marginBottom: '8px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontWeight: 'bold' }}>{player.nombre}</span>
                                    <span className="badge-main" style={{ marginTop: '4px', width: 'fit-content' }}>
                                        {player.rolFinal.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            
        </div>
    );
}

export default GenerateTeamsScreen;