import { extendTheme } from '@mui/joy/styles';

const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          50: '#eff6ff',
          500: '#2563EB',
          600: '#1E40AF',
          solidBg: '#2563EB',
          solidHoverBg: '#1E40AF',
        },
        background: {
          body: '#F8FAFC',    // Fundo geral
          surface: '#FFFFFF', // Cards e Tabelas
        },
      },
    },
  },
  components: {
    JoyCard: {
      styleOverrides: {
        root: {
          border: 'none', // Remove bordas de cards/funções
          boxShadow: 'none', 
          borderRadius: '8px',
        },
      },
    },
    JoySheet: {
      styleOverrides: {
        root: {
          border: 'none', // Remove bordas de containers Sheet
          boxShadow: 'none',
        },
      },
    },
    JoyListItemButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#F1F5F9', // Hover cinza muito leve
          },
        },
      },
    },
  },
});

export default theme;