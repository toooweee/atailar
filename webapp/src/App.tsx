import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes.tsx';
import { SnackbarProvider } from './contexts/SnackbarProvider.tsx';

function App() {

  const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#1a3852',
      },
      secondary: {
        main: '#33a2d9',
      },
    },
    shape: { borderRadius: 10 },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
