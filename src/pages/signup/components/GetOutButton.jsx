import { Link } from 'react-router-dom';
import styled from 'styled-components';

const GetOutButtonStyle = styled.button`
  background-color: #0e7400;
  margin-top: 66px;
  border-radius: 41px;
  padding: 24px 88px;
  color: white;
  font-size: 16px;
  font-weight: 500;
`;

const GetOutButton = () => {
  return (
    <GetOutButtonStyle>
      <Link to="/home">우물 밖으로 나가기</Link>
    </GetOutButtonStyle>
  );
};

export default GetOutButton;
