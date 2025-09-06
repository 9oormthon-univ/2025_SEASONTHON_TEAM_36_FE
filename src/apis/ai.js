import mainApi from '.';

const BASE = '/api/v1/ai';

export async function destructToDoByAI(todoId, options = {}) {
  const { data } = await mainApi.post(`${BASE}/${todoId}/generate`, {
    headers: { 'Content-Type': 'application/json' },
    signal: options.signal,
  });
  return data;
}

export default {
  destructToDoByAI,
};
