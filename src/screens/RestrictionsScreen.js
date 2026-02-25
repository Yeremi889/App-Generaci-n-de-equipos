import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getGroupDetails, saveGroupData } from '../utils/storage';

function RestrictionsScreen() {
    const { groupName } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState({ players: [], restrictions: [] });
    const [newRes, setNewRes] = useState({ jugadorA: '', jugadorB: '', prioridad: 1 });

    useEffect(() => { setData(getGroupDetails(groupName)); }, [groupName]);

    const addRes = () => {
        if (!newRes.jugadorA || !newRes.jugadorB || newRes.jugadorA === newRes.jugadorB) return alert("Selecciona dos distintos");
        const updated = { ...data, restrictions: [...data.restrictions, { ...newRes, id: Date.now().toString() }] };
        saveGroupData(groupName, updated);
        setData(updated);
    };

    return (
        <div className="screen-content fade-in">
            <header style={{marginBottom:'20px'}}>
                <button onClick={() => navigate(-1)} className="back-link">← Volver al Grupo</button>
                <h2>Restricciones</h2>
            </header>

            <div className="card shadow-sm" style={{background: '#f8f9fa'}}>
                <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                    <select className="main-input" onChange={e => setNewRes({...newRes, jugadorA: e.target.value})}>
                        <option value="">Jugador A...</option>
                        {data.players.map(p => <option key={p.id} value={p.nombre}>{p.nombre}</option>)}
                    </select>
                    <div style={{textAlign:'center', fontWeight:'bold', color:'#fd7e14'}}>NO JUEGA CON</div>
                    <select className="main-input" onChange={e => setNewRes({...newRes, jugadorB: e.target.value})}>
                        <option value="">Jugador B...</option>
                        {data.players.map(p => <option key={p.id} value={p.nombre}>{p.nombre}</option>)}
                    </select>
                    <select className="main-input" value={newRes.prioridad} onChange={e => setNewRes({...newRes, prioridad: parseInt(e.target.value)})}>
                        <option value={1}>Poca importancia (P1)</option>
                        <option value={2}>Importante (P2)</option>
                        <option value={3}>Extrema (Separar sí o sí) (P3)</option>
                    </select>
                    <button onClick={addRes} className="btn-orange" style={{background:'#333'}}>AÑADIR REGLA</button>
                </div>
            </div>

            <div style={{marginTop:'20px'}}>
                {data.restrictions.map(r => (
                    <div key={r.id} className="card" style={{display:'flex', justifyContent:'space-between', alignItems:'center', borderLeft:'4px solid #dc3545'}}>
                        <span><b>{r.jugadorA}</b> 🚫 <b>{r.jugadorB}</b> <small>(P{r.prioridad})</small></span>
                        <button onClick={() => {
                            const updated = { ...data, restrictions: data.restrictions.filter(x => x.id !== r.id) };
                            saveGroupData(groupName, updated);
                            setData(updated);
                        }} style={{background:'none', border:'none', cursor:'pointer'}}>🗑️</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default RestrictionsScreen;