import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import theme from './theme/theme';
import MainLayout from './layouts/MainLayout.tsx';


function App() {
  return (
    <CssVarsProvider theme={theme} defaultMode="light">
      
      <CssBaseline />   
      <MainLayout />
      
      </CssVarsProvider>
  );
}

export default App;