import axios from 'axios';

const instance = axios.create({
  baseURL: 'MUSICALL_URL',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    // Añadir más encabezados según sea necesario
  },
});

export default instance;
