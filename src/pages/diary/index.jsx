import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import diaryWriteImg from '@/assets/images/diary-write.svg';

const Screen = styled.div`
  /* Main 영역을 꽉 채우도록 flex 설정 */
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  width: 100%;
  height: 100vh;

  background-image: url('/src/assets/images/night-sky.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 76px;
  padding: 12px 24px;
`;

export default function Diary() {
  const navigate = useNavigate();

  useEffect(() => {
    // 다이어리 화면에 들어올 때 스크롤 차단
    document.body.style.overflow = 'hidden';

    // 나갈 때는 다시 복구
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <Screen>
      <Header>
        <h1 style={{ color: 'white', fontSize: 'var(--fs-2xl)' }}>일기</h1>
        <button onClick={() => navigate('writing')}>
          <img src={diaryWriteImg} alt="다이어리 작성" width="24" height="24" />
        </button>
      </Header>
    </Screen>
  );
}
