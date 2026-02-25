import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// IMPORTACIÓN DE ESTILOS GLOBALES (Los que crearemos en el siguiente paso)
import './styles/global.css';
import './styles/components.css';
import './styles/animations.css';

// IMPORTACIÓN DE PANTALLAS
import HomeScreen from './screens/HomeScreen';
import GroupDetailScreen from './screens/GroupDetailScreen';
import GenerateTeamsScreen from './screens/GenerateTeamsScreen';
import PlayerFormScreen from './screens/PlayerFormScreen'; // Nueva pantalla independiente
import RestrictionsScreen from './screens/RestrictionsScreen'; // Nueva pantalla independiente

function App() {
  return (
    <Router>
      {/* Usamos una clase "app-container" en lugar de estilos en línea.
         Esto permite que el diseño sea responsive y mucho más limpio.
      */}
      <div className="app-container">
        <Routes>
          {/* 1. Lista de Grupos (Página de inicio) */}
          <Route path="/" element={<HomeScreen />} />
          
          {/* 2. Detalle del Grupo (Lista de jugadores y convocatoria) */}
          <Route path="/group/:groupName" element={<GroupDetailScreen />} />
          
          {/* 3. Formulario de Jugador (Crear/Editar) */}
          <Route path="/add-player/:groupName" element={<PlayerFormScreen />} />
          
          {/* 4. Gestión de Restricciones (Quien no juega con quien) */}
          <Route path="/restrictions/:groupName" element={<RestrictionsScreen />} />
          
          {/* 5. Resultados del Algoritmo (Los equipos de 6 ya formados) */}
          <Route path="/generate" element={<GenerateTeamsScreen />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;