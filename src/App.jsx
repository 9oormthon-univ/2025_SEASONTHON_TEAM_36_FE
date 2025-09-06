import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import AppLayout from './layout/AppLayout';
import DiaryLayout from './layout/DiaryLayout';
import ProtectedRoute from './layout/ProtectedRoute';
import Calendar from './pages/calendar';
import Diary from './pages/diary';
import Read from './pages/diary/Read';
import Write from './pages/diary/Write';
import HomePage from './pages/home';
import Login from './pages/login';
import OAuthCallback from './pages/oauth';
import SignUpDone from './pages/signup';

// 테스트를 위한 임시 페이지 콘텐츠, 추후 삭제 예정
const Screen = ({ title }) => (
  <div style={{ padding: '24px 16px' }}>
    <h1>{title}</h1>
    <p>임시 화면</p>
  </div>
);

function App() {
  // 앱 시작 시 기본 테마 지정 (라이트/다크)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute />}></Route>
        <Route path="/" element={<Login />} />
        <Route path="/login/oauth2/code/kakao" element={<OAuthCallback />} />
        <Route path="/signup/done" element={<SignUpDone />} />
        <Route element={<AppLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/diary" element={<Diary />} />
          <Route path="/profile" element={<Screen title="프로필" />} />
        </Route>
        <Route element={<DiaryLayout />}>
          <Route path="/diary/writing" element={<Write />} />
          <Route path="/diary/:id" element={<Read />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
