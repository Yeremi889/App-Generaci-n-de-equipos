import React from 'react';
import { POS_MAP } from '../utils/constants';

function PlayerCard({ player, isSelected, onToggle, onDelete }) {
    return (
        <div className={`player-card-modern ${isSelected ? 'selected' : ''}`} onClick={onToggle}>
            <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
                <div className={`check-indicator ${isSelected ? 'active' : ''}`}></div>
                <div>
                    <div className="player-name">{player.nombre}</div>
                    <div className="pos-chips-list">
                        <span className="badge-main">{POS_MAP[player.posicionPrincipal]}</span>
                        {player.posicionesSecundarias.map(sec => (
                            <span key={sec} className="badge-sec">{POS_MAP[sec]}</span>
                        ))}
                    </div>
                </div>
            </div>
            <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
                <span className="player-avg-bubble">{player.promedio}</span>
                <button className="btn-trash-icon" onClick={onDelete}>🗑️</button>
            </div>
        </div>
    );
}
export default PlayerCard;