import React, { useState } from 'react';
import { 
  Box, Button, Input, Typography, Sheet, FormControl, FormLabel, Stack, Snackbar
} from '@mui/joy';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import WarningIcon from '@mui/icons-material/Warning';

// CORREÇÃO: A interface agora aceita o parâmetro 'name' que o App.tsx espera
interface LoginProps {
  onLogin: (name: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulação de login
    if (user === 'admin' && pass === '123') {
      // Passamos o nome do usuário (ou o próprio login) para o onLogin
      onLogin(user); 
    } else {
      setError(true);
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      width: '100vw',
      bgcolor: 'background.body',
      '& *': { '--joy-focus-thickness': '0px !important', outline: 'none !important' } 
    }}>
      
      <Snackbar
        autoHideDuration={3000}
        open={error}
        variant="solid"
        color="danger"
        onClose={() => setError(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        startDecorator={<WarningIcon />}
      >
        Usuário ou senha incorretos.
      </Snackbar>

      <Sheet
        variant="plain"
        sx={{
          width: 320,
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          bgcolor: 'transparent'
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography level="h2" fontWeight="xl" color="primary" sx={{ mb: 1 }}>
            PGP Health System
          </Typography>
          <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
            Acesso Restrito
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Stack gap={2}>
            <FormControl>
              <FormLabel>Usuário</FormLabel>
              <Input
                variant="soft"
                size="lg"
                placeholder="Insira seu usuário"
                startDecorator={<PersonIcon />}
                value={user}
                onChange={(e) => setUser(e.target.value)}
                sx={{ bgcolor: 'neutral.softBg' }}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Senha</FormLabel>
              <Input
                type="password"
                variant="soft"
                size="lg"
                placeholder="••••••••"
                startDecorator={<LockIcon />}
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                sx={{ bgcolor: 'neutral.softBg' }}
              />
            </FormControl>

            <Button 
              type="submit" 
              size="lg" 
              sx={{ 
                mt: 2,
                boxShadow: 'sm',
                '&:active': { transform: 'scale(0.98)' } 
              }}
            >
              Entrar
            </Button>
          </Stack>
        </form>
      </Sheet>
    </Box>
  );
}