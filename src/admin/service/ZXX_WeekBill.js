import request from 'ADMIN_UTILS/httpRequest';

//  劳务和中介不同意周薪与中介费
export const disAgreeWeekBill = param => request('/ZXX_WeekBill/ZXX_WeekBill_Disagree', param);

//  劳务和中介同意周薪与中介费   
export const agreeWeekBill = param => request('/ZXX_WeekBill/ZXX_WeekBill_Agree', param);

// 周薪查询获取bizid（异步）
export const getWeeklyWageListBizId = param => request('/ZXX_WeekBill/ZXX_WeekBill_Salary_Select', param);
// 周薪查询结果（异步）
export const getWeeklyWageListData = param => request('/ZXX_WeekBill/ZXX_WeekBill_GetLongTaskResult', param);

//  周薪查询导出
export const exportWeeklyWageList = param => request('/ZXX_WeekBill/ZXX_WeekBill_Salary_Export', param);

//  周薪查询导出中介平台费用
export const exportWeeklyWageSPAmout = param => request('/ZXX_WeekBill/ZXX_WeekBill_Sp_Export', param);

//  周薪账单
export const getWeeklyWageBillList = param => request('/ZXX_WeekBill/ZXX_WeekBill_Select', param);

//  周薪账单导出
export const exportWeeklyWageBillList = param => request('/ZXX_WeekBill/ZXX_WeekBill_Export', param);

//  周薪账单明细
export const getWeeklyWageBillDetailList = param => request('/ZXX_WeekBill/ZXX_WeekBill_Detail_Select', param);

//  周薪账单明细导出
export const exportWeeklyWageBillDetailList = param => request('/ZXX_WeekBill/ZXX_WeekBill_Detail_Export', param);

// 导入周薪记录查询
export const getWeeklyWageImportList = param => request('/ZXX_WeekBill/ZXX_WeekBill_Import_Select', param);

//  导入周薪记录导出
export const exportWeeklyWageImportRecord = param => request('/ZXX_WeekBill/ZXX_WeekBill_Import_Export', param);

//  导入周薪记录导出结果查询
export const getWeeklyWageExportRes = param => request('/ZXX_WeekBill/ZXX_WeekBill_GetExportResult', param);

//  周薪拆分查询
export const getWeeklyWageSplitSelect = param => request('/ZXX_WeekBill/ZXX_WeekBill_Split_Select', param);

//  周薪拆分查询导出
export const exportWeeklyWageSplit = param => request('/ZXX_WeekBill/ZXX_WeekBill_Split_Export', param);

// 作废未审核的周薪账单
export const CancelBatch = param => request('/ZXX_WeekBill/ZXX_WeekBill_Cancel_Batch', param);

// 发薪进度查询
export const ProgressOfPay = param => request('/ZXX_KanBan/QueryPaySchedule', param);
