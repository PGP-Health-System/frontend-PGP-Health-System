import React, { useState } from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import theme from './theme/theme'; // Seu arquivo de tema
import Login from './modules/Login/Login';
import MainLayout from './layouts/MainLayout';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');

  const handleLogin = (name: string) => {
    setUserName(name || 'Administrador');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    // O Provider DEVE envolver a lógica do IF
    <CssVarsProvider theme={theme} defaultMode="light">
      {/* O Baseline garante que o fundo escuro/claro se aplique ao <body> */}
      <CssBaseline /> 

      {!isAuthenticated ? (
        <Login onLogin={handleLogin} />
      ) : (
        <MainLayout userName={userName} onLogout={handleLogout} />
      )}
    </CssVarsProvider>
  );
}