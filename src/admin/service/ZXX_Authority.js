import request from 'ADMIN_UTILS/httpRequest';

// 加载资源列表
export const loadResources = param => request('/ZXX_Authority/ZXX_AUTH_LoadResources', param);

// 平台资源 crud
export const loadSysResources = param => request('/ZXX_Authority/ZXX_AUTH_LoadSysResources', param);
export const createResource = param => request('/ZXX_Authority/ZXX_AUTH_CreateResource', param);
export const updateResource = param => request('/ZXX_Authority/ZXX_AUTH_UpdateResource', param);
export const deleteResource = param => request('/ZXX_Authority/ZXX_AUTH_DeleteResource', param);
export const updateResources = param => request('/ZXX_Authority/ZXX_AUTH_UpdateResources', param);

// 平台角色 crud
export const createRole = param => request('/ZXX_Authority/ZXX_AUTH_CreateRole', param);
export const deleteRole = param => request('/ZXX_Authority/ZXX_AUTH_DeleteRole', param);
export const updateRole = param => request('/ZXX_Authority/ZXX_AUTH_UpdateRole', param);
export const loadRoleList = param => request('/ZXX_Authority/ZXX_AUTH_LoadRoleList', param);

// 创建角色-资源对应关系
export const configRoleResource = param => request('/ZXX_Authority/ZXX_AUTH_ConfigRoleResource', param);
// 获取用户列表
export const authLoadRoleUser = param => request('/ZXX_Authority/ZXX_AUTH_QueryUser', param);
// 新增用户信息
export const authCreateUser = param => request('/ZXX_Authority/ZXX_AUTH_CreateUser', param); 
// 提交编辑后的用户信息
export const authUpdateUser = param => request('/ZXX_Authority/ZXX_AUTH_UpdateUser', param);

// 服务商角色 crud
export const zxxaLoadRoleList = param => request('/ZXX_Authority/ZXX_AUTH_LoadRoleList', param);

