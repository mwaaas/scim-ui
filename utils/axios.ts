import { env } from '@/lib/env';
import axios from 'axios';

const baseURL = 'http://localhost:3000/';
const scimToken=env.SCIM_TOKEN

const axiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        "Authorization":`Bearer ${scimToken}`
    },
});

export default axiosInstance;