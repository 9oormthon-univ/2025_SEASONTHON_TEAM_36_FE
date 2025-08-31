import { Route, Routes } from 'react-router-dom';
import Login from './pages/login';
import Home from './pages/home';
import ProtectedRoute from './layout/ProtectedRoute';
import SignUpDone from './pages/signup';
import OAuthCallback from './pages/oauth';

function App() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Login />} />
        <Route path="/oauth/callback/kakao" element={<OAuthCallback />} />
        <Route path="/signup/done" element={<SignUpDone />} />
        <Route path="/home" element={<Home />} />
      </Route>
    </Routes>
  );
}

export default App;
