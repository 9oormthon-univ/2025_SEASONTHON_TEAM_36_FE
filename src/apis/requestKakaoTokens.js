import axios from 'axios';

const requestKakaoTokens = async code => {
  try {
    const formData = new FormData();
    formData.append('grant_type', 'authorization_code');
    formData.append('client_id', import.meta.env.VITE_KAKAO_REST_API_KEY);
    formData.append('redirect_uri', import.meta.env.VITE_KAKAO_REDIRECT_URI);
    formData.append('code', code);
    const response = await axios.post(`https://kauth.kakao.com/oauth/token`, formData, {
      headers: {
        'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
};

export default requestKakaoTokens;
