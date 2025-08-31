export const noLoginRoutes = new Set();
export const loginRoutes = new Set();

// 비로그인 회원이 접속 가능한 라우트 경로
noLoginRoutes.add('/');

// 로그인 회원이 접속 가능한 라우트 경로
loginRoutes.add('/signup/done');
loginRoutes.add('/home');