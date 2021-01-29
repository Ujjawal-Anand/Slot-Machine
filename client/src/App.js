import HomePage from './pages/HomePage'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar';


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/register" component={RegistrationPage} />
        <Route path="/login" component={LoginPage} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
