import request from 'ADMIN_UTILS/httpRequest';

//  导入月薪查询  
export const getMonthlyWageImportList = param => request('/ZXX_MonthBill/ZXX_MonthBill_GetMonthBatchRealList', param);

//  导入月薪查询(导出)  
export const exportMonthlyWageImportRecord = param => request('/ZXX_MonthBill/ZXX_MonthBill_ExportMonthBatchReal', param);

//  月薪批次劳务审批 
export const auditMonthlyWageBill = param => request('/ZXX_MonthBill/ZXX_MonthBill_SetMonthBillAuditState', param);

//  月薪查询 
export const getMonthlyWageList = param => request('/ZXX_MonthBill/ZXX_MonthBill_GetMonthBatchList', param);

//  月薪查询(导出) 
export const exportMonthlyWageList = param => request('/ZXX_MonthBill/ZXX_MonthBill_ExportMonthBatch', param);

//  月薪查询导出平台费
export const exportMonthlyWageSPAmount = param => request('/ZXX_MonthBill/ZXX_MonthBill_ExportPlatFormAmt', param);

//  月薪账单查询 
export const getMonthlyWageBillList = param => request('/ZXX_MonthBill/ZXX_MonthBill_GetMonthBatchBillList', param);

//  月薪账单查询(导出)
export const exportMonthlyWageBillList = param => request('/ZXX_MonthBill/ZXX_MonthBill_ExportMonthBatchBill', param);

//  月薪账单详情查询
export const getMonthlyWageBillDetailList = param => request('/ZXX_MonthBill/ZXX_MonthBill_GetMonthBatchDetail', param);

//  月薪账单详情查询(导出)
export const exportMonthlyWageBillDetailList = param => request('/ZXX_MonthBill/ZXX_MonthBill_ExportMonthBatchDetail', param);

//  生成补发月薪账单
export const generateMonthlyWageReBatch = param => request('/ZXX_MonthBill/ZXX_MonthBill_GenerateReBatch', param);

// 月薪应发未发查询
export const NotPaySelect = param => request('/ZXX_MonthBill/ZXX_MonthBill_NotPay_Select', param);

// 月薪应发未发导出
export const NotPayExport = param => request('/ZXX_MonthBill/ZXX_MonthBill_NotPay_Export', param);

// 添加身份证
export const AddOneIdCardRecord = param => request('/ZXX_MonthBill/ZXX_MonthBill_AddOneIdCardRecord', param);

// 添加工牌记录
export const AddOneWorkCardRecord = param => request('/ZXX_MonthBill/ZXX_MonthBill_AddOneWorkCardRecord', param);

// 添加银行卡记录
export const AddOneBankCardRecord = param => request('/ZXX_MonthBill/ZXX_MonthBill_AddOneBankCardRecord', param);

//  月薪查漏-批量处理
export const handleMonthlyWageLeak = param => request('/ZXX_MonthBill/ZXX_MonthBill_Leak_Handle', param);

//  月薪查漏-导出
export const expMonthlyWageLeak = param => request('/ZXX_MonthBill/ZXX_MonthBill_Leak_Export', param);

//  月薪查漏-查询
export const listMonthlyWageLeak = param => request('/ZXX_MonthBill/ZXX_MonthBill_Leak_Select', param);
//  月导出结果查询
export const getMonthlyWageExportRes = param => request('/ZXX_MonthBill/ZXX_MonthBill_GetExportResult', param);


//  工资单查询
export const Select = param => request('/ZXX_MonthBill/ZXX_Payroll_Select', param);

//  工资单审核
export const Audit = param => request('/ZXX_MonthBill/ZXX_Payroll_Audit', param);

//  工资单作废
export const destroyPayRoll = param => request('/ZXX_MonthBill/PayrollInvalid', param);

// 作废未审核的月薪账单
export const CancelBatch = param => request('/ZXX_MonthBill/ZXX_MonthBill_Cancel_Batch', param);
