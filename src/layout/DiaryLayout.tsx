import { Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";

import { ModalHeader } from "@/common/components/PageModal";

const Shell = styled.div`
  // margin-top: 60px;
  overflow-x: hidden;
`;

export default function DiaryLayout() {
  const navigate = useNavigate();
  return (
    <Shell>
      <ModalHeader variant="back-left" onBack={() => void navigate(-1)} />
      <Outlet />
    </Shell>
  );
}
