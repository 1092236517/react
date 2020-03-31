import request from 'ADMIN_UTILS/httpRequest';

//  导入检查
export const impCheck = param => request('/ZXX_WeekReturnFee/WeekBillGen_ImportCheck', param);

//  查询导入周返费检查结果
export const getImpCheckRes = param => request('/ZXX_WeekReturnFee/WeekBillGen_GetImportCheckResult', param);

//  查询结果aliyun
export const getResFromAliyun = (url) => request(url, {});

//  批次列表(查询)
export const listBill = param => request('/ZXX_WeekReturnFee/WeekBill_GetBatchList', param);

//  批次列表(查询)
export const expBill = param => request('/ZXX_WeekReturnFee/WeekBill_ExportBatchList', param);

//  作废批次
export const destroyBill = param => request('/ZXX_WeekReturnFee/WeekBill_CancelBatch', param);

//  审核批次
export const auditBill = param => request('/ZXX_WeekReturnFee/WeekBill_AuditBatch', param);

//  按批次ID, 导出账单详情列表
export const expBillDetail = param => request('/ZXX_WeekReturnFee/WeekBill_ExportDetailListByBatch', param);

//  按批次ID, 查询账单详情列表
export const listBillDetail = param => request('/ZXX_WeekReturnFee/WeekBill_GetDetailListByBatch', param);

//  导出预览
export const expPreview = param => request('/ZXX_WeekReturnFee/WeekBillGen_ExportPreview', param);

//  生成周返费账单
export const geneBatch = param => request('/ZXX_WeekReturnFee/WeekBillGen_GenerateBatch', param);

//  生成周返费账单(根据bizID）
export const geneBatchByBizID = param => request('/ZXX_WeekReturnFee/WeekBillGen_GenerateBatchByBizID', param);

//  生成周返费账单结果查询
export const getGeneBatchRes = param => request('/ZXX_WeekReturnFee/WeekBillGen_GetGenerateBatchResult', param);

//  周返费（查询）
export const listDetail = param => request('/ZXX_WeekReturnFee/WeekBill_GetAllDetailList', param);

//  周返费（查询）
export const expDetail = param => request('/ZXX_WeekReturnFee/WeekBill_ExportAllDetailList', param);

//  异步导出结果查询
export const getExpRes = param => request('/ZXX_WeekReturnFee/WeekBill_GetExportResult', param);

//  异步导出结果查询
export const reissueCheckSingle = param => request('/ZXX_WeekReturnFee/WeekBillGen_CheckSingle', param);