import { extendTheme } from '@mui/joy/styles';

const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          solidBg: '#007FFF',
          solidHoverBg: '#0066CC',
        },
        background: {
          body: '#f4f6f8',
        },
      },
    },
    dark: {
      palette: {
        primary: {
          solidBg: '#007FFF',
          solidHoverBg: '#3399FF',
        },
        background: {
          body: '#0b0d0e',
        },
      },
    },
  },
  fontFamily: {
    display: 'Inter, var(--joy-fontFamily-fallback)',
    body: 'Inter, var(--joy-fontFamily-fallback)',
  },
});

export default theme;