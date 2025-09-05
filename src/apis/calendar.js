import mainApi from './';

export const calendarApi = async (year, month) => {
  const response = await mainApi.get(`/api/v1/steps/calendar?year=${year}&month=${month}`);
  return response.data;
};
