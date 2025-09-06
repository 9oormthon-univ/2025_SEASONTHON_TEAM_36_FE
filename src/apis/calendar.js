import mainApi from './';

export const calendarApi = async (year, month) => {
  const { data } = await mainApi.get(`/api/v1/calendars?year=${year}&month=${month}`);
  return data;
};
