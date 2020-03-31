import request from 'ADMIN_UTILS/httpRequest';

//  周薪单条检查
export const weeklyWageCheckSingle = param => request('/ZXX_WeekBillGen/ZXX_WeekBillGen_CheckSingle', param);


//  导入周薪检查
export const importWeeklyWageCheck = param => request('/ZXX_WeekBillGen/ZXX_WeekBillGen_ImportCheck', param);

//  查询导入周薪检查结果
export const getResultImportWeeklyWageCheck = param => request('/ZXX_WeekBillGen/ZXX_WeekBillGen_GetImportCheckResult', param);

//  生成周薪账单
export const generateWeeklyWageBatch = param => request('/ZXX_WeekBillGen/ZXX_WeekBillGen_GenerateBatch', param);

//  通过导入id生成周薪账单
export const generateWeeklyWageBatchByBiz = param => request('/ZXX_WeekBillGen/ZXX_WeekBillGen_GenerateBatchByBizID', param);

//  获取生成周薪账单结果
export const getResultgenerateWeeklyWageBatch = param => request('/ZXX_WeekBillGen/ZXX_WeekBillGen_GetGenerateBatchResult', param);

//  导出预览结果
export const exportPreview = param => request('/ZXX_WeekBillGen/ZXX_WeekBillGen_ExportPreview', param);

//  查询结果aliyun
export const getResultFromAliyun = (url) => request(url, {});
//  根据身份证号码查找用户信息
export const getUerInfoById = param => request('/ZXX_WeekBillGen/ZXX_GetPossibleNameInfo', param);

//  获取补发明细
export const getAmountDetail = param => request('/ZXX_WeekBillGen/ZXX_GetPossibleNameInfo', param);

//  根据身份证号码查找用户银行卡信息
export const importIdForBankCard = param => request('/ZXX_FetchData/FetchBank_Import', param);
//  导出银行卡信息
export const exportBankCardPreview = param => request('/ZXX_FetchData/FetchBank_Export', param);



