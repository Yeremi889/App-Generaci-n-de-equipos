import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import GroupDetailScreen from './screens/GroupDetailScreen';
import GenerateTeamsScreen from './screens/GenerateTeamsScreen'; // Importamos la nueva pantalla

function App() {
  return (
    <Router>
      <div style={{ 
        maxWidth: '600px', 
        margin: '0 auto', 
        minHeight: '100vh', 
        background: '#f9f9f9', 
        boxShadow: '0 0 10px rgba(0,0,0,0.1)' 
      }}>
        <Routes>
          {/* Pantalla principal con la lista de grupos */}
          <Route path="/" element={<HomeScreen />} />
          
          {/* Pantalla de detalle del grupo (donde están los jugadores y el botón naranja) */}
          <Route path="/group/:groupName" element={<GroupDetailScreen />} />
          
          {/* Pantalla de resultados (donde el algoritmo muestra los equipos formados) */}
          <Route path="/generate" element={<GenerateTeamsScreen />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;