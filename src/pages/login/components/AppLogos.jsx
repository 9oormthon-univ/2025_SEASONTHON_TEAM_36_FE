import styled from "styled-components";

import AppLogoImg from "../../../assets/images/app-logo-frog.png";
import AppTitleImg from "../../../assets/images/app-title.png";

const AppLogosStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 34px;
  margin-top: 200px;
  margin-bottom: 150px;
`;

const AppLogos = () => {
  return (
    <AppLogosStyle>
      <img src={AppLogoImg} alt="개구리 얼굴" width="262" />
      <img src={AppTitleImg} alt="우물밖 개구리" width="224" />
    </AppLogosStyle>
  );
};

export default AppLogos;
