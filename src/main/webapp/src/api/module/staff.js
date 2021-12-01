// 应用管理接口
import request from "../request";

/** 接口 */
const Api = {
  list: "/api/user/list",
  userInfo: "/api/user/get/",
  saveUser: "/api/user/save",
  updateUser: "/api/user/update",
  deleteUser: "/api/user/remove/",
  deleteUsers: "/api/user/delete", // 批量删除用户
  setRoles: "/api/user/role" // 设置角色
};
/** 获取部门列表树 */
export const queryUserList = params => {
  return request.request({
    url: Api.list,
    params,
    method: "get"
  });
};

export const getUserInfo = params => {
  return request.request({
    url: Api.userInfo + params.userId,
    method: "get"
  });
};

// 新增用户
export const saveUser = data => {
  return request.request({
    url: Api.saveUser,
    data,
    method: "post",
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
};

// 修改用户
export const updateUser = data => {
  return request.request({
    url: Api.updateUser,
    data,
    method: "put",
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
};

// 删除用户
export const deleteUser = data => {
  return request.delete({
    url: `${Api.deleteUser}${data.userId}`
  });
};

// 删除用户
export const batchDeleteUser = data => {
  return request.delete({
    url: `${Api.deleteUsers}?userIds=${data.userIds.join(",")}`
  });
};

// 设置用户角色
export const setRoles = data => {
  return request.request({
    url: Api.setRoles,
    data,
    method: "post",
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
};
