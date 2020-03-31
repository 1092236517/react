import request from 'ADMIN_UTILS/httpRequest';

//  订单差价补贴清单
export const GetSubsidyList = param => request('/ZXX_SettlementManager/GetSubsidyList', param);

// 导出
export const ExportSubsidyList = param => request('/ZXX_SettlementManager/ExportSubsidyList', param);

// 获取导出结果
export const GetTaskResult = param => request('/ZXX_SettlementManager/GetTaskResult', param);

// 月薪发放进度查询
export const GetMonthSalarySchedule = param => request('/ZXX_SettlementManager/GetMonthSalarySchedule', param);

// 月薪发放进度导出
export const ExportMonthSalarySchedule = param => request('/ZXX_SettlementManager/ExportMonthSalarySchedule', param);
