// 应用管理接口
import request from "../request";

/** 接口 */
const Api = {
  list: "/api/department/treeByDepartment",
  getDepById: "/api/department/byId/", // 获取部门信息
  saveDep: "/api/department/save", // 保存部门
  deleteDep: "/api/department/remove/", // 删除部门
  updateDep: "/api/department/update", // 修改部门
  uploadLogo: "/api/department/upload/logo" // 上传部门logo
};
/** 获取部门列表树 */
export const queryList = params => {
  return request.request({
    url: Api.list,
    params,
    method: "get"
  });
};

export const saveDep = data => {
  return request.request({
    url: Api.saveDep,
    data,
    method: "post",
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
};

// 获取部门详情
export const getDepById = params => {
  return request.request({
    url: `${Api.getDepById}${params.departmentId}`,
    method: "get"
  });
};

export const deleteDep = data => {
  return request.delete({
    url: `${Api.deleteDep}${data.departmentId}`
  });
};

// 修改部门
export const updateDep = data => {
  return request.request({
    url: Api.updateDep,
    data,
    method: "put",
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
};

// 上传部门LOGO
export const uploadLogo = () => {
  return process.env.VUE_APP_API_BASE_URL + Api.uploadLogo;
};
