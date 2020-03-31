import request from 'ADMIN_UTILS/httpRequest';

// 作废名单
export const listInvalid = param => request('/ZXX_NameManager/ZXX_DeleteNameByIdList', param);

// 同步名单
export const saveSynch = param => request('/ZXX_NameManager/ZXX_SynchronousNameList', param);

// 导出名单
export const importList = param => request('/ZXX_NameManager/ZXX_ExportNameListToExcel', param);

// 绑定订单
export const bind = param => request('/ZXX_NameManager/ZXX_BindOrder', param);
// 获取名单列表
export const getList = param => request('/ZXX_NameManager/ZXX_GetNameList', param);