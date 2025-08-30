import { Route, Routes } from 'react-router-dom';
import Login from './pages/login';
import SignUpDone from './pages/signup';
import Home from './pages/home';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup/done" element={<SignUpDone />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}

export default App;
