import request from "../request";

const Api = {
  page: "/api/post/page",
  list: "/api/post/list",
  remove: "/api/post/delete/",
  removeBatch: "/api/sys/post/removeBatch",
  save: "/api/post/save",
  edit: "/api/post/update"
};

/** 岗位列表 */
export const page = data => {
  return request.request({
    url: Api.page,
    params: data,
    method: "GET"
  });
};

/** 岗位列表 */
export const list = data => {
  return request.request({
    url: Api.list,
    params: data,
    method: "GET"
  });
};

/** 新增岗位 */
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

/** 修改岗位 */
export const edit = data => {
  return request.request({
    url: Api.edit,
    data: data,
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  });
};

/** 删除岗位 */
export const remove = data => {
  return request.delete({
    url: Api.remove + data.postId
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
