// 应用管理接口
import request from "../request";

/** 接口 */
const Api = {
  page: "/api/application/page",
  remove: '/api/application/remove/',
  add: '/api/application/save'
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
    return request.request({
    url: `${Api.page}${data.applicationId}`,
    method: "DELETE"
  });
}

// 保存应用
export const addApp = data => {
  return request.request({
    url: Api.add,
    data,
    method: "post"
  });
};