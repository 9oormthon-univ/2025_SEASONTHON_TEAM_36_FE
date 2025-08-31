import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import OAuthCallback from './pages/oauth';
import SignUpDone from './pages/signup';
import AppLayout from './layout/AppLayout';
import ProtectedRoute from './layout/ProtectedRoute';
import { useEffect } from 'react';

// 테스트를 위한 임시 페이지 콘텐츠, 추후 삭제 예정
const Screen = ({ title }) => (
  <div style={{ padding: '24px 16px' }}>
    <h1>{title}</h1>
    <p>임시 화면</p>
  </div>
);

function App() {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Login />} />
          <Route path="/oauth/callback/kakao" element={<OAuthCallback />} />
          <Route path="/signup/done" element={<SignUpDone />} />
          <Route element={<AppLayout />}>
            <Route path="/home" element={<Screen title="홈" />} />
            <Route path="/calendar" element={<Screen title="캘린더" />} />
            <Route path="/diary" element={<Screen title="다이어리" />} />
            <Route path="/profile" element={<Screen title="프로필" />} />
          </Route>
          {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
