import React, { useState } from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import theme from './theme/theme'; 
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
    <CssVarsProvider 
      theme={theme} 
      defaultMode="light" 
      // modeStorageKey impede que ele tente recuperar uma escolha de "dark" salva anteriormente
      modeStorageKey="sistema-medico-mode" 
      // disableNestedContext garante estabilidade no tema único
      disableNestedContext
    >
      {/* O Baseline é fundamental para aplicar a cor #f4f6f8 que definimos no body do tema */}
      <CssBaseline /> 

      {!isAuthenticated ? (
        <Login onLogin={handleLogin} />
      ) : (
        <MainLayout userName={userName} onLogout={handleLogout} />
      )}
    </CssVarsProvider>
  );
}