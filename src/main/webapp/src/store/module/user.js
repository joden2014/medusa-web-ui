import {
  menu,
  power,
  login,
  logout,
  userInfo,
  refreshToken,
  getUserType
} from "@/api/module/user";
import { generateRoute, generatePower } from "@/route/permission";
import { message } from "ant-design-vue";
import initMenu from "../../route/module/init-routes"; // 初始化菜单

const state = {
  token: localStorage.getItem("token") ? localStorage.getItem("token") : "",
  tokenKey: localStorage.getItem("token_key")
    ? localStorage.getItem("token_key")
    : "",
  userInfo: localStorage.getItem("user_info")
    ? localStorage.getItem("user_info")
    : null,
  userRoutes: localStorage.getItem("user_routes")
    ? localStorage.getItem("user_routes")
    : [],
  userPowers: localStorage.getItem("user_powers")
    ? localStorage.getItem("user_powers")
    : []
};

const mutations = {
  SET_USER_TOKEN(state, token) {
    if (token) {
      state.tokenKey = token.key;
      state.token = token.value;
      localStorage.setItem("token_key", token.key); // 刷新token
      localStorage.setItem("token", token.value);
    } else {
      state.tokenKey = "";
      state.token = "";
      localStorage.removeItem("token_key");
      localStorage.removeItem("token");
    }
  },
  SET_USER_INFO(state, userInfo) {
    if (userInfo) {
      state.userInfo = JSON.stringify(userInfo);
      localStorage.setItem("user_info", JSON.stringify(userInfo));
    } else {
      state.userInfo = null;
      localStorage.removeItem("user_info");
    }
  },
  SET_USER_ROUTE(state, menuList) {
    if (menuList && menuList.length === 0) {
      state.userRoutes = [];
      localStorage.removeItem("user_routes");
    } else {
      const finalMenu = menuList;
      state.userRoutes = finalMenu;
      localStorage.setItem("user_routes", JSON.stringify(finalMenu));
    }
  },
  SET_USER_POWER(state, powerList) {
    if (powerList && powerList.length === 0) {
      state.userPowers = [];
      localStorage.removeItem("user_powers");
    } else {
      const finalPower = powerList;
      state.userPowers = finalPower;
      localStorage.setItem("user_powers", JSON.stringify(finalPower));
    }
  }
};

const actions = {
  async refreshToken({ commit }) {
    const params = {
      refreshToken: state.tokenKey
    };
    const { code, message, data } = await refreshToken(params);
    if (code === "200") {
      commit("SET_USER_TOKEN", {
        key: data.refresh_token,
        value: data.access_token
      });
      return Promise.resolve();
    } else {
      return Promise.reject(message);
    }
  },
  async login({ commit }, params) {
    const { code, message, data } = await login(params);
    if (code === "200") {
      commit("SET_USER_TOKEN", {
        key: data.refresh_token,
        value: data.access_token
      });
      return Promise.resolve();
    } else {
      return Promise.reject(message);
    }
  },

  async logout({ commit }) {
    const params = {
      accessToken: state.token
    };
    await logout(params);
    message.success("退出成功", 0.5).then(function() {
      commit("SET_USER_TOKEN");
      commit("SET_USER_ROUTE");
      commit("SET_USER_INFO");
      window.location.reload();
    });
    return Promise.resolve();
  },

  async addRoute({ commit }) {
    const { userId } =
      Object.prototype.toString.call(state.userInfo) === "[object Object]"
        ? state.userInfo
        : JSON.parse(state.userInfo);
    const { data } = await menu({ userId });
    if (data) {
      commit(
        "SET_USER_ROUTE",
        generateRoute(data[0].menuPath === null ? initMenu : data)
      );
    } else {
      commit("SET_USER_ROUTE", generateRoute(initMenu));
    }
  },

  async addPower({ commit }) {
    const { userId } =
      Object.prototype.toString.call(state.userInfo) === "[object Object]"
        ? state.userInfo
        : JSON.parse(state.userInfo);
    const { data } = await power({ userId });
    commit("SET_USER_POWER", generatePower(data));
  },
  async getUserInfo({ commit }) {
    const { data } = await userInfo();
    const isAdmin = await getUserType({ userId: data.userId });
    commit("SET_USER_INFO", { ...data, isAdmin: isAdmin.data });
  }
};
export default {
  namespaced: true,
  mutations,
  actions,
  state
};
