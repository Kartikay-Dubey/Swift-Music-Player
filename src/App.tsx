import { ThemeProvider as MuiThemeProvider, createTheme, CssBaseline } from '@mui/material';
import MusicPlayer from './components/MusicPlayer';
import { ThemeProvider } from './context/ThemeContext';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1db954',
    },
    background: {
      default: '#121212',
      paper: '#1a1a1a',
    },
  },
});

function App() {
  return (
    <MuiThemeProvider theme={darkTheme}>
      <CssBaseline />
      <ThemeProvider>
        <MusicPlayer />
      </ThemeProvider>
    </MuiThemeProvider>
  );
}

export default App; 