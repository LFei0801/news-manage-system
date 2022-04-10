import axios from "axios";
import { CHANGE_LOADING } from "../redux/const";
import { store } from "../redux/store";

axios.defaults.baseURL = "http://localhost:8080";

// 添加请求拦截器
axios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    store.dispatch({
      type: CHANGE_LOADING,
      isLoading: true,
    });
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    store.dispatch({
      type: CHANGE_LOADING,
      isLoading: false,
    });
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axios.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    store.dispatch({
      type: CHANGE_LOADING,
      isLoading: false,
    });
    return response;
  },
  function (error) {
    // 对响应错误做点什么
    store.dispatch({
      type: CHANGE_LOADING,
      isLoading: false,
    });
    return Promise.reject(error);
  }
);
