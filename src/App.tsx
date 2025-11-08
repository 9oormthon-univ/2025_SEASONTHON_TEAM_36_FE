import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "./layout/AppLayout";
import DiaryLayout from "./layout/DiaryLayout";
import ProtectedRoute from "./layout/ProtectedRoute";
import Calendar from "./pages/calendar";
import Chatbot from "./pages/chatbot";
import Diary from "./pages/diary";
import Read from "./pages/diary/components/ReadPage";
import Write from "./pages/diary/components/WritePage";
import HomePage from "./pages/home";
import Login from "./pages/login";
import OAuthCallback from "./pages/oauth";
import Profile from "./pages/profile";
import SignUpDone from "./pages/signup";

function App() {
  // 앱 시작 시 기본 테마 지정 (라이트/다크)
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "light");
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
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route element={<DiaryLayout />}>
          <Route path="/diary/writing" element={<Write />} />
          <Route path="/diary/:date" element={<Read />} />
        </Route>
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
