// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:8080/api'
// });

// export default api;


import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api", // Change this to your backend URL
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials: true, // Uncomment if your backend uses cookies for auth
});

export default api;