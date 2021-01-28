import HomePage from './pages/HomePage'
import { BrowserRouter } from 'react-router-dom'

import SlotMachine from './components/SlotMachine';

function App() {
  return (
    <BrowserRouter>
      <HomePage />
    </BrowserRouter>
  );
}

export default App;
