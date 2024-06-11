const ENV = process.env.NODE_ENV || 'development';

let apiUrl;

if (ENV === 'production') {
  apiUrl = 'MUSICALL_URL';
} else {
  apiUrl = 'http://localhost:3000'; // cualquier puerto libre, por defecto 3000 en React
}

export { apiUrl };
