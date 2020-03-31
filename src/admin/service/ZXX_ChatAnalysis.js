import request from 'ADMIN_UTILS/httpRequest';

// 导入检查
export const ImportCheck = param => request('/ZXX_BrokerChat/ZXX_BrokerChat_ImportCheck', param);

// 提交保存
export const Generate = param => request('/ZXX_BrokerChat/ZXX_BrokerChat_Generate', param);

// 
export const tableListQuery = param => request('/ZXX_BrokerChat/ZXX_BrokerChat_List', param);

// 导出
export const exportData = param => request('/ZXX_BrokerChat/ZXX_BrokerChat_Export', param);

