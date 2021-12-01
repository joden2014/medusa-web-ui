// 应用管理接口
import request from "../request";

/** 接口 */
const Api = {
  page: "/api/application/page",
  remove: "/api/application/remove/",
  add: "/api/application/save",
  uploadIcon: "/api/application/upload/logo/",
  appMenu: "/api/menu/byApplication/", // 获取应用菜单
  saveMenu: "/api/menu/save", // 保存应用菜单
  deleteMenu: "/api/menu/delete/",
  updateApp: "/api/application/update", // 更新应用
  getAppById: "/api/application/byId/",
  getAppMenuById: "/api/menu/info",
  updateMenu: "/api/menu/update", // 修改菜单
  switchStatus: "/api/application/disabled" // 修改应用状态
};
/** 获取应用信息 */
export const queryList = (params) => {
  return request.request({
    url: Api.page,
    params,
    method: "get",
  });
};

// 删除应用
export const remove = (data) => {
  return request.delete({
    url: `${Api.remove}${data.applicationId}`,
  });
};

// 保存应用
export const addApp = (data) => {
  return request.request({
    url: Api.add,
    data,
    method: "post",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
  });
};

// 上传应用图标
export const uploadLogo = (data) => {
  return `${Api.uploadIcon}${data.applicationId}`;
};

// 获取应用菜单
export const getAppMenu = (params) => {
  return request.request({
    url: `${Api.appMenu}${params.applicationId}`,
    method: "get",
  });
};

export const addMenu = (data) => {
  return request.request({
    url: Api.saveMenu,
    data,
    method: "post",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
  });
};

export const deleteMenu = (data) => {
  return request.delete({
    url: `${Api.deleteMenu}${data.menuId}`,
  });
};

// 更新应用
export const updateApp = (data) => {
  return request.request({
    url: Api.updateApp,
    data,
    method: "post",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
  });
};

// 获取应用详情
export const getAppById = (params) => {
  return request.request({
    url: `${Api.getAppById}${params.applicationId}`,
    method: "get",
  });
};

// 获取菜单详情
export const getMenuById = (params) => {
  return request.request({
    url: Api.getAppMenuById,
    params,
    method: "get",
  });
};

// 修改菜单
export const updateMenu = (data) => {
  return request.request({
    url: Api.updateMenu,
    data,
    method: "put",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
  });
};

export const switchStatus = (data) => {
  return request.request({
    url: Api.switchStatus,
    data,
    method: "post"
  });
};