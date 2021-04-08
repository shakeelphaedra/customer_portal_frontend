import axios from 'axios';
import env from 'react-dotenv';

export const baseURL = process.env.REACT_APP_API_URL;


  const axiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 100000,
    headers: {
      Authorization: localStorage.getItem('access_token')
        ? 'Bearer ' + localStorage.getItem('access_token')
        : null,
      'Content-Type': 'application/json',
      accept: 'application/json',
    }, 
  });



  axiosInstance.interceptors.request.use(
	async (config) => {
	  const token = localStorage.getItem("access_token")
	  config.headers = {
		Authorization: token ? `Bearer ${token}` : null,
		Accept: "application/json",
		"Content-Type": "application/json",
	  };
	  return config;
	},
	(error) => {
	  Promise.reject(error);
	}
  );

  const refreshAccessToken = async () => {
	const token = localStorage.getItem("refresh_token");
	const res = await axiosInstance.post(
	  `${baseURL}/api/token/refresh/`, { refresh: token }
	);
	return res.data.access;
  };

  axiosInstance.interceptors.response.use(
	(response) => {
		return response;
	  },
	  async function (error) {
		const originalRequest = error.config;
		if (error.response?.status === 401 && !originalRequest._retry) {
		  originalRequest._retry = true;
		  const access_token = await refreshAccessToken();
		  localStorage.setItem("access_token", access_token);
		  axios.defaults.headers.common["Authorization"] = "Bearer " + access_token;
		  return axiosInstance(originalRequest);
		}
		return Promise.reject(error);
	  }); 

   
 


  export default axiosInstance;
