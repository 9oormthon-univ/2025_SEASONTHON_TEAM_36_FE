import { useState, useEffect } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { InputAdornment, IconButton, TextField } from '@mui/material';
import CalendarImg from '../../../../assets/images/calendar-input.svg';

export default function CustomDatePicker() {
  const [value, setValue] = useState(null);
  const [open, setOpen] = useState(false);

  // 선택된 날짜 출력
  useEffect(() => {
    console.log('선택된 날짜:', value?.format('YYYY.MM.DD') ?? '없음');
  }, [value]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        value={value}
        onChange={newValue => setValue(newValue)}
        format="YYYY.MM.DD"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        enableAccessibleFieldDOMStructure={false}
        slotProps={{
          popper: {
            modifiers: [
              { name: 'offset', options: { offset: [0, 4] } }, // TextField 하단 4px
            ],
          },
        }}
        slots={{
          textField: params => (
            <TextField
              {...params}
              fullWidth
              variant="standard"
              placeholder="YYYY.MM.DD"
              InputProps={{
                ...params.InputProps,
                sx: {
                  paddingTop: '12px',
                  paddingBottom: '12px',
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  // 기본 밑줄 색상
                  '&:before': {
                    borderBottom: '1px solid var(--natural-400)',
                  },
                  // hover 상태 (색 유지)
                  '&:hover:not(.Mui-disabled):before': {
                    borderBottom: '1px solid var(--natural-400)',
                  },
                  // 포커스 시 파란색 애니메이션 제거
                  '&:after': {
                    borderBottom: '1px solid var(--natural-400)',
                    transform: 'scaleX(1) !important',
                    transition: 'none !important', // 애니메이션 제거
                  },
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      style={{ padding: 0 }}
                      onClick={() => setOpen(prev => !prev)}
                      edge="end"
                    >
                      <img src={CalendarImg} alt="달력" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          ),
        }}
      />
    </LocalizationProvider>
  );
}
