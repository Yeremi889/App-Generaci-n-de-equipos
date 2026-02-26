import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getGroupDetails, saveGroupData } from '../utils/storage';

function RestrictionsScreen() {
    const { groupName } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState({ players: [], restrictions: [] });
    
    const [queryA, setQueryA] = useState('');
    const [queryB, setQueryB] = useState('');
    const [showSuggestionsA, setShowSuggestionsA] = useState(false);
    const [showSuggestionsB, setShowSuggestionsB] = useState(false);
    
    const [newRes, setNewRes] = useState({ jugadorA: '', jugadorB: '', prioridad: 1 });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => { 
        const groupData = getGroupDetails(groupName);
        if (groupData) setData(groupData); 
    }, [groupName]);

    // --- LÓGICA DE FILTRADO ---
    const suggestionsA = data.players.filter(p => 
        p.nombre.toLowerCase().includes(queryA.toLowerCase()) && p.nombre !== newRes.jugadorB
    );

    const suggestionsB = data.players.filter(p => 
        p.nombre.toLowerCase().includes(queryB.toLowerCase()) && p.nombre !== newRes.jugadorA
    );

    const existingRes = useMemo(() => {
        if (!newRes.jugadorA || !newRes.jugadorB) return null;
        return data.restrictions.find(r => 
            (r.jugadorA === newRes.jugadorA && r.jugadorB === newRes.jugadorB) || 
            (r.jugadorA === newRes.jugadorB && r.jugadorB === newRes.jugadorA)
        );
    }, [newRes.jugadorA, newRes.jugadorB, data.restrictions]);

    const addOrUpdateRes = () => {
        if (!newRes.jugadorA || !newRes.jugadorB) return;
        
        let updatedRestrictions;
        if (existingRes) {
            updatedRestrictions = data.restrictions.map(r => 
                r.id === existingRes.id ? { ...r, prioridad: newRes.prioridad } : r
            );
        } else {
            updatedRestrictions = [...data.restrictions, { ...newRes, id: Date.now().toString() }];
        }

        const updatedData = { ...data, restrictions: updatedRestrictions };
        saveGroupData(groupName, updatedData);
        setData(updatedData);
        // Limpiar todo
        setNewRes({ jugadorA: '', jugadorB: '', prioridad: 1 });
        setQueryA(''); setQueryB('');
    };

    return (
        <div className="screen-content fade-in" style={{ padding: '20px' }}>
            <header style={{ marginBottom: '25px', display: 'flex', alignItems: 'center' }}>
                <button onClick={() => navigate(-1)} className="back-link" style={{ fontSize: '24px', marginRight: '15px' }}>←</button>
                <h2 style={{ margin: 0, fontWeight: '800' }}>Crear <span style={{ color: '#fd7e14' }}>Restricción</span></h2>
            </header>

            <div className="card shadow-lg" style={{ background: '#fff', borderRadius: '20px', padding: '25px', border: 'none' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', position: 'relative' }}>
                    
                    {/* BUSCADOR JUGADOR A */}
                    <div style={{ position: 'relative' }}>
                        <input 
                            className="main-input" 
                            placeholder="Buscar Jugador A..."
                            value={queryA}
                            onChange={(e) => { setQueryA(e.target.value); setShowSuggestionsA(true); }}
                            onFocus={() => setShowSuggestionsA(true)}
                        />
                        {showSuggestionsA && queryA && (
                            <div className="suggestions-box">
                                {suggestionsA.map(p => (
                                    <div key={p.id} className="suggestion-item" onClick={() => {
                                        setNewRes({...newRes, jugadorA: p.nombre});
                                        setQueryA(p.nombre);
                                        setShowSuggestionsA(false);
                                    }}>{p.nombre}</div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div style={{ textAlign: 'center', fontWeight: '900', color: '#fd7e14', fontSize: '14px' }}>Hace Drama Con</div>

                    {/* BUSCADOR JUGADOR B */}
                    <div style={{ position: 'relative' }}>
                        <input 
                            className="main-input" 
                            placeholder="Buscar Jugador B..."
                            value={queryB}
                            onChange={(e) => { setQueryB(e.target.value); setShowSuggestionsB(true); }}
                            onFocus={() => setShowSuggestionsB(true)}
                        />
                        {showSuggestionsB && queryB && (
                            <div className="suggestions-box">
                                {suggestionsB.map(p => (
                                    <div key={p.id} className="suggestion-item" onClick={() => {
                                        setNewRes({...newRes, jugadorB: p.nombre});
                                        setQueryB(p.nombre);
                                        setShowSuggestionsB(false);
                                    }}>{p.nombre}</div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* FRAME DE ACCIÓN */}
                    {newRes.jugadorA && newRes.jugadorB && (
                        <div className="fade-in shadow-sm" style={{ marginTop: '10px', padding: '20px', borderRadius: '15px', background: '#fff9f4', border: '1px solid #ffe8d6' }}>
                            <label style={{ fontSize: '12px', fontWeight: '700', color: '#8d8d8d', marginBottom: '8px', display: 'block' }}>PRIORIDAD DE RESTRICCIÓN</label>
                            <select className="main-input" value={newRes.prioridad} onChange={e => setNewRes({...newRes, prioridad: parseInt(e.target.value)})}>
                                <option value={1}>Leve (P1)</option>
                                <option value={2}>Importante (P2)</option>
                                <option value={3}>Crítica (P3)</option>
                            </select>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                                <button onClick={addOrUpdateRes} className="btn-orange" style={{ flex: 2, borderRadius: '12px' }}>
                                    {existingRes ? 'ACTUALIZAR' : 'CREAR VÍNCULO'}
                                </button>
                                {existingRes && (
                                    <button onClick={() => {
                                        const updated = { ...data, restrictions: data.restrictions.filter(x => x.id !== existingRes.id) };
                                        saveGroupData(groupName, updated);
                                        setData(updated);
                                        setNewRes({ jugadorA: '', jugadorB: '', prioridad: 1 });
                                        setQueryA(''); setQueryB('');
                                    }} className="btn-main" style={{ flex: 1, background: '#ff4b4b', borderRadius: '12px' }}>🗑️</button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* LISTA Y BÚSQUEDA GENERAL */}
            <div style={{ marginTop: '30px' }}>
                <div style={{ position: 'relative', marginBottom: '20px' }}>
                    <input 
                        type="text" 
                        placeholder="🔍 Buscar restricción..." 
                        className="main-input shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ borderRadius: '30px', paddingLeft: '45px', border: 'none' }}
                    />
                </div>
                
                <div style={{ display: 'grid', gap: '12px' }}>
                    {data.restrictions.filter(r => r.jugadorA.toLowerCase().includes(searchTerm.toLowerCase()) || r.jugadorB.toLowerCase().includes(searchTerm.toLowerCase())).map(r => (
                        <div key={r.id} className="card-restriction shadow-sm">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '4px', height: '30px', background: r.prioridad === 3 ? '#ff4b4b' : '#fd7e14', borderRadius: '10px' }}></div>
                                <span style={{ fontSize: '15px' }}><b>{r.jugadorA}</b> vs <b>{r.jugadorB}</b></span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <span className="badge-p">P{r.prioridad}</span>
                                <button onClick={() => {
                                    const updated = { ...data, restrictions: data.restrictions.filter(x => x.id !== r.id) };
                                    saveGroupData(groupName, updated);
                                    setData(updated);
                                }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>✕</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default RestrictionsScreen;