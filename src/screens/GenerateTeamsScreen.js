// src/screens/GenerateTeamsScreen.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { generateTeams } from '../utils/algorithm';
import TeamDisplay from '../components/TeamDisplay';

function GenerateTeamsScreen() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [teams, setTeams] = useState(null);

    const handleGenerate = () => {
        setTeams(generateTeams(state.players, state.restrictions, state.numTeams));
    };

    useEffect(() => {
        if (state?.players) handleGenerate();
    }, [state]);

    if (!teams) return <div className="loader">Generando...</div>;

    return (
        <div className="screen-wrapper">
            <button onClick={() => navigate(-1)} className="back-btn">← Reconvocar</button>
            <div className="teams-grid">
                {teams.map((team, idx) => (
                    <TeamDisplay key={idx} team={team} />
                ))}
            </div>
            <button onClick={handleGenerate} className="regen-btn">REGENERAR MEJENGA</button>
        </div>
    );
}

export default GenerateTeamsScreen;