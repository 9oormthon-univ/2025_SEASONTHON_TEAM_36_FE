import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import { useEffect } from "react";


// 테스트를 위한 임시 페이지 콘텐츠, 추후 삭제 예정 
const Screen = ({ title }) => (
  <div style={{ padding: "24px 16px" }}>
    <h1>{title}</h1>
    <p>임시 화면</p>
  </div>
);
const Splash = () => <div>스플래시…</div>;
const Login = () => <div>로그인 폼 자리</div>;

export default function App() {

  // 앱 시작 시 기본 테마 지정 (라이트/다크)
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "light");
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        {/* 스플래시/로그인 페이지 */}
        <Route path="/splash" element={<Splash />} />
        <Route path="/login" element={<Login />} />

        {/* 메인 앱 페이지 (NavBar 포함) */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<Screen title="홈" />} />
          <Route path="/calendar" element={<Screen title="캘린더" />} />
          <Route path="/diary" element={<Screen title="다이어리" />} />
          <Route path="/profile" element={<Screen title="프로필" />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
