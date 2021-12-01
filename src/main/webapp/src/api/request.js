import axios from "axios";
import { message as Msg } from "ant-design-vue";
import store from "../store";
import qs from "qs";
import Router from "../route";
import NProgress from "nprogress";
axios.defaults.headers.put["Content-Type"] = "application/json;charset=UTF-8";
class Request {
  constructor(config) {
    this.config = config || {
      timeout: 20000,
      withCredentials: true,
      baseURL: process.env.VUE_APP_API_BASE_URL,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
      }
    };
  }

  interceptors(instance) {
    /// 请求拦截
    instance.interceptors.request.use(
      config => {
        /// 权鉴相关
        // const tokenKey = localStorage.getItem("token_key");
        const token = localStorage.getItem("token");
        if (token) config.headers["Authorization"] = `Bearer ${token}`;
        // if(tokenKey) config.headers["Authorization-key"] = tokenKey;
        config.cancelToken = new axios.CancelToken(async cancel => {
          await store.dispatch("app/execCancelToken", { cancelToken: cancel });
        });
        /// 格式化 []
        // if (config.method === "delete") {
        //   config.paramsSerializer = params => {
        //     return qs.stringify(params, { arrayFormat: "repeat" });
        //   };
        // }
        if (
          config.method === "post" &&
          config.headers["Content-Type"] ===
            "application/x-www-form-urlencoded;charset=UTF-8"
        ) {
          config.transformRequest = [
            function(data) {
              // 对 data 进行任意转换处理
              return qs.stringify(config.data);
            }
          ];
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );

    /// 响应拦截
    instance.interceptors.response.use(
      response => {
        const { code, success, message } = response.data;
        if (success) {
          return response.data;
        } else {
          Msg.error(message);
          return Promise.reject(success);
        }
      },
      error => {
        if (error.response) {
          const { status } = error.response;
          if (status === 404) {
            Msg.error("接口不存在");
          }
          if (status === 403 || status === 401) {
            store.commit("user/SET_USER_TOKEN");
            Router.push({ path: "/login", replace: true });
            const message = "登录失效，请重新登录";
            Msg.error(message);
          }
          // if(status === 401){
          //   store.dispatch('user/refreshToken')
          // }
        } else {
          let { message } = error;
          if (message === "Network Error") {
            message = "连接异常";
          }
          if (message.includes("timeout")) {
            message = "请求超时";
          }
          if (message.includes("Request failed with status code")) {
            message = "接口异常";
          }
          Msg.error(message);
        }
        NProgress.done();
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

  // 删除
  delete({ url, data, params }, config = {}) {
    const instance = axios.create({ ...this.config });
    this.interceptors(instance);
    config.headers = {
      "Content-Type": "application/x-www-form-urlencoded"
    };
    return instance.delete(url, {
      data: { ...config, ...data },
      params
    });
  }
}

export default new Request();
