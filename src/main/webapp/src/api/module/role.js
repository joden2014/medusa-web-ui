import request from "../request";

/** 接口管理 */
const Api = {
  page: "/api/role/list",
  list: "/api/role/userNum",
  save: "/api/role/save",
  edit: "/api/role/update",
  give: "/api/sys/role/give",
  remove: "/api/role/delete/",
  removeBatch: "/api/sys/role/removeBatch",
  power: "/api/sys/role/power",
  dept: "/api/sys/role/dept",
  roleInfo: "/api/role/byId/",
  switchStatus: "/api/role/update/status",
  setUser: "/api/role/user", // 设置用户
  getUserRoleList: "/api/role/listByUserId", // 获取用户角色列表
  getRoleUser: "/api/user/listByRoleId/" // 获取角色用户列表
};

/** 角色列表 (分页) */
export const page = data => {
  return request.request({
    url: Api.page,
    params: data,
    method: "GET"
  });
};

/** 角色列表 */
export const list = data => {
  return request.request({
    url: Api.list,
    params: data,
    method: "GET"
  });
};

/** 新增角色 */
export const save = data => {
  return request.request({
    url: Api.save,
    data: data,
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
};

/** 修改角色 */
export const edit = data => {
  return request.request({
    url: Api.edit,
    data: data,
    method: "PUT",
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
};

/** 删除角色 */
export const remove = data => {
  return request.delete({
    url: `${Api.remove}${data.roleId}`
  });
};

/** 批量删除 */
export const removeBatch = data => {
  return request.request({
    url: Api.removeBatch,
    params: data,
    method: "DELETE"
  });
};

/** 角色权限 */
export const power = data => {
  return request.request({
    url: Api.power,
    params: data,
    method: "GET"
  });
};

/** 分配权限 */
export const give = data => {
  return request.request({
    url: Api.give,
    data: data,
    method: "POST"
  });
};

/** 角色部门 */
export const dept = data => {
  return request.request({
    url: Api.dept,
    params: data,
    method: "GET"
  });
};

// 获取用户角色
export const getUserRoleList = params => {
  return request.request({
    url: Api.getUserRoleList,
    params,
    method: "GET"
  });
};

// 获取角色详情
export const getRoleInfo = params => {
  return request.request({
    url: Api.roleInfo + params.roleId,
    method: "GET"
  });
};

export const switchStatus = data => {
  return request.request({
    url: Api.switchStatus,
    data,
    method: "put"
  });
};

// 给权限设置用户
export const setUsers = data => {
  return request.request({
    url: Api.setUser,
    data: data,
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
};

// 角色用户列表
export const getRoleUserList = params => {
  return request.request({
    url: Api.getRoleUser + params.roleId,
    method: "GET",
    params
  });
};
