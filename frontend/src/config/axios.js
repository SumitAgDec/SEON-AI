import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))?.token || ''
            }`,
    },
});

export default axiosInstance;
