import axios from "axios";
// import { getToken } from "./authHelper";

const API = axios.create({
    baseURL:"https://rentmyride-f10r.onrender.com/api"
    //  "http://localhost:5000/api",
});


//  GLOBAL LOADER
let setGlobalLoading;

export const setLoaderHandler = (fn) => {
    setGlobalLoading = fn;
};

// REQUEST
API.interceptors.request.use((config) => {
    setGlobalLoading && setGlobalLoading(true);
    return config;
});

// RESPONSE
API.interceptors.response.use(
    (res) => {
        setGlobalLoading && setGlobalLoading(false);
        return res;
    },
    (err) => {
        setGlobalLoading && setGlobalLoading(false);
        return Promise.reject(err);
    }
);



// Add token automatically
API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    // const token = getToken();
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;