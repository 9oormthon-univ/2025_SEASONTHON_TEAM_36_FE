import styled from 'styled-components';

const Day = styled.div`
  border-radius: 100%;
  padding: 5px 8.5px;
  background-color: ${props => (props.$checked ? 'var(--green-500)' : 'var(--natural-200)')};
  color: ${props => (props.$checked ? 'white' : 'black')};
  font-size: var(--fs-sm);
  transition: background-color 0.1s linear, color 0.1s linear;
`;

const Days = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px 10px 6.39px 10px;
`;

const WeekButtons = ({ checkDays, handleDays }) => {
  const days = ['월', '화', '수', '목', '금', '토', '일'];
  return (
    <Days>
      {days.map((day, index) => (
        <Day
          key={index}
          $checked={checkDays[index]}
          onClick={() => {
            handleDays(index);
          }}
        >
          {day}
        </Day>
      ))}
    </Days>
  );
};

export default WeekButtons;
