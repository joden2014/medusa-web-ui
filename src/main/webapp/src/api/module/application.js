// 应用管理接口
import request from "../request";

/** 接口 */
const Api = {
  page: "/api/application/page",
  remove: "/api/application/remove/",
  add: "/api/application/save",
  uploadIcon: "/api/application/upload/logo/",
  appMenu: "/api/menu/byApplication/"
};
/** 获取应用信息 */
export const queryList = params => {
  return request.request({
    url: Api.page,
    params,
    method: "get"
  });
};

// 删除应用
export const remove = data => {
  return request.delete({
    url: `${Api.remove}${data.applicationId}`
  });
};

// 保存应用
export const addApp = data => {
  return request.request({
    url: Api.add,
    data,
    method: "post",
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
};

// 上传应用图标
export const uploadLogo = data => {
  return `${Api.uploadIcon}${data.applicationId}`;
};

export const getAppMenu = params => {
  return request.request({
    url: `${Api.appMenu}${params.applicationId}`,
    method: "get"
  })
}