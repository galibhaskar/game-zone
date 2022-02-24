import './App.css';
import { Stack } from '@mui/material';
import { AuthProvider } from './provider/AuthProvider';
import { Main } from './components/main';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <header className="App-header">
          {/* <img src={logo} className="App-logo" alt="logo" /> */}
          <Stack className='appContainer'>
            <Main />
          </Stack>

        </header>
      </div>
    </AuthProvider>
  );
}

export default App;
