import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// GLOBALES 
import './styles/global.css';
import './styles/components.css';
import './styles/animations.css';

// PANTALLAS
import HomeScreen from './screens/HomeScreen';
import GroupDetailScreen from './screens/GroupDetailScreen';
import GenerateTeamsScreen from './screens/GenerateTeamsScreen';
import PlayerFormScreen from './screens/PlayerFormScreen'; 
import RestrictionsScreen from './screens/RestrictionsScreen';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* 1. Lista de Grupos (Página de inicio) */}
          <Route path="/" element={<HomeScreen />} />
          
          {/* 2. Detalle del Grupo (Lista de jugadores y selección) */}
          <Route path="/group/:groupName" element={<GroupDetailScreen />} />
          
          {/* 3. Formulario de Jugador (Crear/Editar) */}
          <Route path="/add-player/:groupName" element={<PlayerFormScreen />} />
          
          {/* 4. Gestión de Restricciones*/}
          <Route path="/restrictions/:groupName" element={<RestrictionsScreen />} />
          
          {/* 5. Resultados del Algoritmo */}
          <Route path="/generate" element={<GenerateTeamsScreen />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;