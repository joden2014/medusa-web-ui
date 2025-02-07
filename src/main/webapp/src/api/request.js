import axios from "axios";
import { message as Msg } from "ant-design-vue";
import store from "../store";
import qs from 'qs';

class Request {

  constructor(config) {
    this.config = config || {
      timeout: 20000,
      withCredentials: true,
      baseURL: process.env.VUE_APP_API_BASE_URL,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    };
  }

  interceptors(instance) {
    
    /// 请求拦截
    instance.interceptors.request.use(
      config => {
        
        /// 权鉴相关
        const tokenKey = localStorage.getItem("token_key");
        const token = localStorage.getItem("token")
        if(token) config.headers["Authorization"] = token;
        if(tokenKey) config.headers["Authorization-key"] = tokenKey;
        config.cancelToken = new axios.CancelToken(async cancel => {
          await store.dispatch("app/execCancelToken", { cancelToken: cancel });
        });
        
        /// 格式化 []
        if (config.method === 'delete') {
          config.paramsSerializer = (params) => {
            return qs.stringify(params, {arrayFormat: 'repeat'})
          }
        }
        
        // if (config.method === "post") {
        //   config.data = qs.stringify(config.data)
        // }

        config.transformRequest = [function (data) {
          // 对 data 进行任意转换处理
          return qs.stringify(config.data)
      }]
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );

    /// 响应拦截
    instance.interceptors.response.use(
      response => {
        return response.data;
      },
      error => {
        if (error.response) {
          const {status} = error.response;
          if (status === 404) {
            Msg.error("接口不存在");
          }
        } else {
          let { message } = error;
          if (message === "Network Error") {
            message = "连接异常"
          }
          if (message.includes("timeout")) {
            message = "请求超时";
          }
          if (message.includes("Request failed with status code")) {
            message = "接口异常";
          }
          Msg.error(message);
        }
        return Promise.reject(error);
      }
    );
  }

  request(options) {
    const instance = axios.create();
    const requestOptions = Object.assign({}, this.config, options);
    this.interceptors(instance);
    return instance(requestOptions);
  }
}

export default new Request();
