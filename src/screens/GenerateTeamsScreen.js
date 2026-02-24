// src/screens/GenerateTeamsScreen.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { generateTeams } from '../utils/algorithm';

function GenerateTeamsScreen() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [teams, setTeams] = useState(null);

    const posMap = { "Punta": "Pnt", "Centro": "CTRL", "Colocador": "CLDR" };
    const posOrder = { "Colocador": 1, "Centro": 2, "Punta": 3 };

    const handleGenerate = () => {
        const result = generateTeams(state.players, state.restrictions, state.numTeams);
        
        // Ordenamos estrictamente por el rol asignado para la mejenga
        const orderedResult = result.map(team => ({
            ...team,
            members: [...team.members].sort((a, b) => 
                posOrder[a.rolAsignado] - posOrder[b.rolAsignado]
            )
        }));
        
        setTeams(orderedResult);
    };

    useEffect(() => {
        if (state?.players) handleGenerate();
    }, [state]);

    if (!teams) return <div style={{padding: '40px', textAlign: 'center'}}>Equilibrando posiciones...</div>;

    return (
        <div style={{ padding: '20px', background: '#f8f9fa', minHeight: '100vh', fontFamily: 'sans-serif' }}>
            <button onClick={() => navigate(-1)} style={{ marginBottom: '20px', border: 'none', background: 'none', color: '#007bff', cursor: 'pointer', fontWeight: 'bold' }}>
                ← Reconvocar
            </button>
            
            <h2 style={{ textAlign: 'center', marginBottom: '25px', color: '#222' }}>Equipos Formados</h2>
            
            <div style={{ display: 'grid', gap: '20px' }}>
                {teams.map((team, idx) => (
                    <div key={idx} style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ margin: '0 0 15px 0', color: '#fd7e14', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' }}>
                            {team.name}
                        </h3>
                        
                        <div style={{ display: 'grid', gap: '8px' }}>
                            {team.members.map(p => {
                                const usoSecundaria = p.rolAsignado !== p.posicionPrincipal;
                                return (
                                    <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span style={{ 
                                                fontWeight: 'bold', 
                                                color: usoSecundaria ? '#fd7e14' : '#666', 
                                                width: '45px', 
                                                fontSize: '11px',
                                                background: '#f0f2f5',
                                                padding: '3px',
                                                borderRadius: '4px',
                                                textAlign: 'center'
                                            }}>
                                                {posMap[p.rolAsignado]}
                                            </span>
                                            <span style={{ fontSize: '15px', color: '#333' }}>
                                                {p.nombre} 
                                                {usoSecundaria && <small style={{fontSize: '10px', color: '#aaa', marginLeft: '5px'}}>*</small>}
                                            </span>
                                        </div>
                                        <span style={{ fontWeight: 'bold', color: '#007bff' }}>{p.promedio}</span>
                                    </div>
                                );
                            })}
                        </div>

                        <div style={{ textAlign: 'right', marginTop: '15px', paddingTop: '10px', borderTop: '1px solid #eee' }}>
                            <span style={{ fontSize: '12px', color: '#999' }}>Nivel de Equipo: </span>
                            <span style={{ fontWeight: 'bold', fontSize: '18px' }}>
                                {team.members.reduce((sum, p) => sum + parseFloat(p.promedio), 0).toFixed(1)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <button onClick={handleGenerate} style={{ width: '100%', padding: '18px', marginTop: '30px', background: '#fd7e14', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                REGENERAR MEJENGA
            </button>
        </div>
    );
}

export default GenerateTeamsScreen;