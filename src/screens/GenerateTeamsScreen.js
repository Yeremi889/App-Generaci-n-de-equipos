import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { generateTeams as generarEquipos } from '../utils/algorithm'; //
import TeamDisplay from '../components/TeamDisplay';

function GenerateTeamsScreen() {
    const location = useLocation();
    const navigate = useNavigate();
    const { players, restrictions, numTeams } = location.state || { players: [], restrictions: [], numTeams: 2 };

    // Ejecuta el algoritmo y memoriza el resultado
    const equipos = useMemo(() => {
        if (!players || players.length === 0) return null;
        return generarEquipos(players, restrictions, numTeams);
    }, [players, restrictions, numTeams]);

    if (!equipos) return (
        <div className="screen-content">
            <button onClick={() => navigate(-1)} className="back-link">← Volver</button>
            <p>Selecciona los jugadores necesarios para jugar</p>
        </div>
    );

    return (
        <div className="screen-content fade-in" style={{ paddingBottom: '40px' }}>
            <header className="header-main">
                <button onClick={() => navigate(-1)} className="back-link">← Volver a Seleccion</button>
                <h1 style={{ marginTop: '10px' }}>Equipos <span style={{ color: '#fd7e14' }}>Generados</span></h1>
            </header>

            {/* Resumen de Calidad */}
            <div className="card-dark" style={{ marginBottom: '25px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', opacity: 0.8 }}>
                    <span>Completitud:</span>
                    <span>{numTeams} Equipos Generados</span>
                </div>
                <div style={{ background: '#444', height: '6px', borderRadius: '3px', marginTop: '8px', overflow: 'hidden' }}>
                    <div style={{ 
                        width: '100%', 
                        height: '100%', 
                        background: '#51cf66'
                    }}></div>
                </div>
            </div>

            {/* Listado de Equipos */}
            <div className="teams-grid">
                {equipos.map((eq, idx) => (
                    <TeamDisplay 
                        key={idx} 
                        teamName={eq.name} 
                        players={eq.members} 
                    />
                ))}
            </div>

            <div style={{ marginTop: '30px' }}>
                <button className="btn-orange shadow-lg pulse" onClick={() => window.location.reload()}>
                     REGENERAR EQUIPOS
                </button>
            </div>
        </div>
    );
}

export default GenerateTeamsScreen;