import request from 'ADMIN_UTILS/httpRequest';

//  导入月薪检查
export const importMonthlyWageCheck = param => request('/ZXX_MonthBillGen/ZXX_MonthBillGen_ImportCheck', param);

//  查询导入月薪检查结果
export const getResultImportMonthlyWageCheck = param => request('/ZXX_MonthBillGen/ZXX_MonthBillGen_GetImportCheckResult', param);

//  月薪单条检查
export const monthlyWageCheckSingle = param => request('/ZXX_MonthBillGen/ZXX_MonthBillGen_CheckSingle', param);

//  生成月薪账单
export const generateMonthlyWageBatch = param => request('/ZXX_MonthBillGen/ZXX_MonthBillGen_GenerateBatch', param);

//  通过导入id生成周薪账单
export const generateMonthlyWageBatchByBiz = param => request('/ZXX_MonthBillGen/ZXX_MonthBillGen_GenerateBatchByBizID', param);

//  查询生成月薪账单结果
export const getResutltGenerateMonthlyWageBatch = param => request('/ZXX_MonthBillGen/ZXX_MonthBillGen_GetGenerateBatchResult', param);

//  导出预览结果
export const exportPreview = param => request('/ZXX_MonthBillGen/ZXX_MonthBillGen_ExportPreview', param);

//  查询结果aliyun
export const getResultFromAliyun = (url) => request(url, {});

//  工资单导入预览
export const ImportPreview = param => request('/ZXX_MonthBillGen/ZXX_Payroll_ImportPreview', param);

//  工资单提交保存
export const Save = param => request('/ZXX_MonthBillGen/ZXX_Payroll_Save', param);

// 工资单预览导出
export const PreviewExport = param => request('/ZXX_MonthBillGen/ZXX_Payroll_PreviewExport', param);

//  补发月薪-批量导入
export const impPreview = param => request('/ZXX_MonthBillGen/ZXX_MonthBillGen_ImportSupple', param);

//  补发月薪-导出预览导入
export const expPreview = param => request('/ZXX_MonthBillGen/ZXX_MonthBillGen_ExportSupplePreview', param);
//  根据身份证号码查找用户信息
export const getUerInfoById = param => request('/ZXX_WeekBillGen/ZXX_GetPossibleNameInfo', param);