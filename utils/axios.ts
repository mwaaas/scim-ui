import { env } from '@/lib/env';
import axios from 'axios';

const baseURL=env.BASE_URL
const scimToken=env.SCIM_TOKEN

const axiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 120000,
    headers: {
        'Content-Type': "application/scim+json",
        'Accept':'*/*',
        "Authorization":`Bearer ${scimToken}`
    },
});

export default axiosInstance;