import React from "react";
import styled from "styled-components";
import BottomSheet from "../../../layout/BottomSheet";

export default function TaskModal() {
  const [open, setOpen] = React.useState(false);
  const openSheet = () => setOpen(true);
  const closeSheet = () => setOpen(false);

  return (
    <Wrapper>
      <ButtonGroup>
        <Btn aria-pressed={open} data-active={open ? "true" : "false"} onClick={openSheet}>
          bottom
        </Btn>
      </ButtonGroup>

      <BottomSheet
        open={open}
        onOpen={openSheet}          // 드래그 업/탭으로 열기
        onClose={closeSheet}
        ariaLabel="bottom drawer"
        peekHeight={28}
        size="56vh"
      >
        <SheetBody>
          <Header>
            <Title className="typo-h3">Mailbox</Title>
            <Close onClick={closeSheet} aria-label="Close drawer">✕</Close>
          </Header>

          <Section>
            <SectionTitle>Primary</SectionTitle>
            <List>
              {["Inbox", "Starred", "Send email", "Drafts"].map((t) => (
                <ListItem key={t}>
                  <ListButton type="button">{t}</ListButton>
                </ListItem>
              ))}
            </List>
          </Section>

          <Divider />

          <Section>
            <SectionTitle>System</SectionTitle>
            <List>
              {["All mail", "Trash", "Spam"].map((t) => (
                <ListItem key={t}>
                  <ListButton type="button">{t}</ListButton>
                </ListItem>
              ))}
            </List>
          </Section>

          <Footer>
            <PrimaryBtn onClick={closeSheet}>확인</PrimaryBtn>
          </Footer>
        </SheetBody>
      </BottomSheet>
    </Wrapper>
  );
}

/* ───────────── styled-components ───────────── */
const Wrapper = styled.div`
  display: grid;
  place-items: center;
  padding: 24px;
  background: var(--bg-1);
  min-height: 60vh;
`;

const ButtonGroup = styled.div`
  display: inline-flex;
  gap: 8px;
  background: var(--surface-2, #f6f7fa);
  padding: 6px;
  border-radius: 999px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 4px 14px rgba(0,0,0,0.06);
`;

const Btn = styled.button`
  appearance: none;
  border: 0;
  padding: 10px 14px;
  border-radius: 999px;
  background: var(--surface-1, #fff);
  color: var(--text-2, #6f737b);
  font-weight: 600;
  letter-spacing: 0.2px;
  cursor: pointer;
  transition: transform 0.08s ease, box-shadow 0.12s ease, background 0.12s ease, color 0.12s ease;
  &[data-active="true"] {
    background: var(--brand-1, #0e7400);
    color: var(--natural-0, #fff);
    box-shadow: 0 2px 10px rgba(0,0,0,0.12);
  }
  &:hover { transform: translateY(-1px); }
  &:active { transform: translateY(0); }
`;

const SheetBody = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 100%;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 18px;
  border-bottom: 1px solid var(--surface-2, #f1f4f8);
`;

const Title = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--text-1, #101014);
  flex: 1;
`;

const Close = styled.button`
  appearance: none; border: 0;
  background: transparent; cursor: pointer;
  font-size: 18px; line-height: 1;
  color: var(--text-2, #6f737b);
  padding: 6px 8px; border-radius: 8px;
  &:hover { background: var(--surface-2, #f6f7fa); }
`;

const Section = styled.section`
  padding: 8px 8px 0;
  overflow: auto;
`;

const SectionTitle = styled.div`
  font-size: 12px;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  color: var(--text-3, #969ba5);
  margin: 12px 8px 6px;
`;

const List = styled.ul`
  list-style: none;
  margin: 0; padding: 0 6px 8px;
`;

const ListItem = styled.li`
  margin: 2px 0;
`;

const ListButton = styled.button`
  width: 100%;
  text-align: left;
  appearance: none; border: 0;
  background: transparent;
  padding: 12px 12px;
  border-radius: 10px;
  color: var(--text-1, #101014);
  font-weight: 600;
  cursor: pointer;
  &:hover { background: var(--surface-2, #f1f4f8); }
  &:active { transform: translateY(0.5px); }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid var(--surface-2, #f1f4f8);
  margin: 8px 0;
`;

const Footer = styled.div`
  margin-top: auto;
  padding: 12px 16px 16px;
  border-top: 1px solid var(--surface-2, #f1f4f8);
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const PrimaryBtn = styled.button`
  appearance: none; border: 0; cursor: pointer;
  padding: 10px 14px; border-radius: 12px;
  font-weight: 700;
  background: var(--brand-1, #0e7400);
  color: var(--natural-0, #fff);
  box-shadow: 0 6px 16px rgba(0,0,0,0.12);
  transition: transform 0.06s ease;
  &:hover { transform: translateY(-1px); }
  &:active { transform: translateY(0); }
`;
