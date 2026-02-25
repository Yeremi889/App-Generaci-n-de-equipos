// src/components/TeamDisplay.js
import React from 'react';
import { POS_MAP } from '../utils/constants';

function TeamDisplay({ teamName, players }) {
    // Cálculo del promedio real del equipo basado en la selección
    const avgTeam = (players.reduce((acc, p) => acc + parseFloat(p.promedio), 0) / players.length).toFixed(1);

    return (
        <div className="card fade-in" style={{ padding: '0', overflow: 'hidden', marginBottom: '20px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
            {/* Encabezado del equipo */}
            <div style={{ background: '#333', color: 'white', padding: '12px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '16px', color: 'white', fontWeight: 'bold' }}>{teamName.toUpperCase()}</h3>
                <span className="player-avg-bubble" style={{ background: '#fd7e14', color: 'white', border: 'none' }}>
                    AVG: {avgTeam}
                </span>
            </div>
            
            {/* Lista de Atletas */}
            <div style={{ padding: '10px' }}>
                {players.map((p, idx) => (
                    <div key={idx} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        padding: '10px 5px', 
                        borderBottom: idx === players.length - 1 ? 'none' : '1px solid #f1f1f1',
                        alignItems: 'center'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '11px', color: '#bbb', width: '15px' }}>{idx + 1}</span>
                            <span style={{ fontWeight: '600', color: '#333' }}>{p.nombre}</span>
                        </div>
                        {/* Muestra el rol que el algoritmo asignó para este sorteo */}
                        <span className="badge-main" style={{ minWidth: '50px', textAlign: 'center' }}>
                            {POS_MAP[p.rolAsignado] || p.rolAsignado}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TeamDisplay;