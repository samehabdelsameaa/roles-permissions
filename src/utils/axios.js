import axios from 'axios';

const apiInstance = axios.create({
  baseURL: 'http://localhost:7000/admin/v1',
  headers: {
    accept: 'application/json',
    'Content-Type': `application/json`
  }
});

export default apiInstance;
