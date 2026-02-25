// src/components/TeamDisplay.js
import React from 'react';
import { POS_MAP, POS_ORDER } from '../utils/constants';

const TeamDisplay = ({ team }) => {
    const sortedMembers = [...team.members].sort((a, b) => 
        POS_ORDER[a.rolAsignado] - POS_ORDER[b.rolAsignado]
    );

    return (
        <div className="team-card">
            <h3 className="team-title">{team.name}</h3>
            <div className="members-list">
                {sortedMembers.map(p => (
                    <div key={p.id} className="member-row">
                        <span className={`pos-badge ${p.rolAsignado !== p.posicionPrincipal ? 'secondary' : ''}`}>
                            {POS_MAP[p.rolAsignado]}
                        </span>
                        <span className="player-name">{p.nombre}</span>
                        <span className="player-avg">{p.promedio}</span>
                    </div>
                ))}
            </div>
            <div className="team-footer">
                <span>Fuerza: </span>
                <strong>{team.members.reduce((s, p) => s + parseFloat(p.promedio), 0).toFixed(1)}</strong>
            </div>
        </div>
    );
};

export default TeamDisplay;