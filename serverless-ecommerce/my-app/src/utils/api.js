import axios from 'axios';

const api = axios.create({
  //baseURL: "http://localhost:8080",
  baseURL: "https://fcqvt5ldy5.execute-api.ap-south-1.amazonaws.com/prod"

});

export default api;

