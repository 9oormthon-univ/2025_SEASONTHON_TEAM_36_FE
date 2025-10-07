import { IconButton, InputAdornment, TextField, TextFieldProps } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import type { Dayjs } from "dayjs";
import { useState } from "react";

import CalendarImg from "../../../assets/images/calendar-input.svg";
import { CustomDatePickerProps } from "../types/props";
import { dateToFormatString } from "../utils/dateUtils";

export default function CustomDatePicker({ index, onChange }: CustomDatePickerProps) {
  const [value, setValue] = useState<Dayjs | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        value={value}
        onChange={(newValue: Dayjs | null) => {
          setValue(newValue);
          if (newValue) {
            // Dayjs 객체의 기본 Date 객체 얻기
            const date = newValue.toDate();
            onChange(index, dateToFormatString(date));
          }
        }}
        format="YYYY.MM.DD"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        enableAccessibleFieldDOMStructure={false}
        slotProps={{
          popper: {
            modifiers: [
              { name: "offset", options: { offset: [0, 4] } }, // TextField 하단 4px
            ],
          },
        }}
        slots={{
          textField: (params: TextFieldProps) => (
            <TextField
              {...params}
              fullWidth
              variant="standard"
              placeholder="YYYY.MM.DD"
              InputProps={{
                ...params.InputProps,
                sx: {
                  paddingTop: "12px",
                  paddingBottom: "12px",
                  paddingLeft: "16px",
                  paddingRight: "16px",
                  // 기본 밑줄 색상
                  "&:before": {
                    borderBottom: "1px solid var(--natural-400)",
                  },
                  // hover 상태 (색 유지)
                  "&:hover:not(.Mui-disabled):before": {
                    borderBottom: "1px solid var(--natural-400)",
                  },
                  // 포커스 시 파란색 애니메이션 제거
                  "&:after": {
                    borderBottom: "1px solid var(--natural-400)",
                    transform: "scaleX(1) !important",
                    transition: "none !important", // 애니메이션 제거
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
