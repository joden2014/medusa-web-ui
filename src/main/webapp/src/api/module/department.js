// 应用管理接口
import request from "../request";

/** 接口 */
const Api = {
  list: "/api/department/list",
};
/** 获取部门列表树 */
export const queryList = (params) => {
  return request.request({
    url: Api.list,
    params,
    method: "get",
  });
};
