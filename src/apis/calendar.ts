import { RespCalendar } from "@/common/types/response/step";

import mainApi from ".";

export const calendarApi = async (year: number, month: number) => {
  const { data }: { data: RespCalendar } = await mainApi.get(
    `/api/v1/calendars?year=${year}&month=${month}`,
  );
  return data;
};
