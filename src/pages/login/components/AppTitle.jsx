import styled from 'styled-components';

import SplashScreenAppTitle from '../../../assets/images/app-title.png';

const AppTitleStyle = styled.div`
  margin-top: 108px;
`;

const AppTitle = ({ width }) => {
  return (
    <AppTitleStyle>
      <img src={SplashScreenAppTitle} alt="우물밖 개구리" width={width} />
    </AppTitleStyle>
  );
};

export default AppTitle;
