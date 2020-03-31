import request from 'ADMIN_UTILS/httpRequest';

// 获取劳务列表
export const GetTrgtSp = param => request('/ZXX_Busi_Manage/ZXX_GetTrgtSp', param);

// 获取劳务账户流水
export const GetSpAccountFlow = param => request('/ZXX_Busi_Manage/ZXX_GetSpAccountFlow', param);

// 获取劳务账户明细
export const GetSpAccountBillDetail = param => request('/ZXX_Busi_Manage/ZXX_GetSpAccountBillDetail', param);

// 导出劳务列表
export const ExportTrgtSpList = param => request('/ZXX_Busi_Manage/ZXX_ExportTrgtSpList', param);

// 导出劳务流水表
export const ExportSpAccountFlow = param => request('/ZXX_Busi_Manage/ZXX_ExportSpAccountFlow', param);

// 获取中介账单
export const GetAgentAccount = param => request('/ZXX_Busi_Manage/ZXX_Busi_Manage_GetAgentAccount', param);

// 获取中介账单详细信息
export const GetAgentDetail = param => request('/ZXX_Busi_Manage/ZXX_Busi_Manage_GetAgentDetail', param);

// 中介账单---导出
export const ExportAgentAccount = param => request('/ZXX_Busi_Manage/ZXX_Busi_Manage_ExportAgentAccount', param);

// 中介账单详细信息---导出
export const ExportAgentDetail = param => request('/ZXX_Busi_Manage/ZXX_Busi_Manage_ExportAgentDetail', param);

// 获取平台盈利列表
export const Platform = param => request('/ZXX_Busi_Manage/ZXX_Platform_Profit_Statement', param);

// 盈利报表
export const Profit = param => request('/ZXX_Busi_Manage/ZXX_Platform_Profit_Statement_Select', param);

// 导出盈利报表
export const ExportProfit = param => request('/ZXX_Busi_Manage/ZXX_Platform_Profit_Statement_Export', param);

// 盈利报表Old
export const ProfitOld = param => request('/ZXX_Busi_Manage/ZXX_Platform_Profit_Statement_Select_Old', param);

// 导出盈利报表Old
export const ExportProfitOld = param => request('/ZXX_Busi_Manage/ZXX_Platform_Profit_Statement_Export_Old', param);

//  关账
export const closeFinance = param => request('/ZXX_Busi_Manage/ZXX_Bill_Close', param);

// 1.0盈利报表
export const ProfitForX = param => request('/ZXX_Busi_Manage/ZXX_Platform_Profit_Statement_Select_ForX', param);

// 1.0导出盈利报表
export const ExportProfitForX = param => request('/ZXX_Busi_Manage/ZXX_Platform_Profit_Statement_Export_ForX', param);

// 1.0盈利报表old
export const ProfitForXOld = param => request('/ZXX_Busi_Manage/ZXX_Platform_Profit_Statement_Select_ForX_Old', param);

// 1.0导出盈利报表old
export const ExportProfitForXOld = param => request('/ZXX_Busi_Manage/ZXX_Platform_Profit_Statement_Export_ForX_Old', param);

//  1.0上传文件
export const uploadFileX = param => request('/ZXX_Busi_Manage/UploadFileForX', param);

//  1.0删除文件
export const delFileX = param => request('/ZXX_Busi_Manage/DeleteFileForX', param);

//  上传文件
export const uploadFile = param => request('/ZXX_Busi_Manage/UploadFile', param);

//  删除文件
export const delFile = param => request('/ZXX_Busi_Manage/DeleteFile', param);

//  查询劳务押金
export const listLaborDepo = param => request('/ZXX_Busi_Manage/ZXX_GetBillLaborDepositList', param);

//  导出劳务押金
export const expLaborDepo = param => request('/ZXX_Busi_Manage/ZXX_ExportBillLaborDepositList', param);

//  刷新劳务押金
export const refreshLaborDepo = param => request('/ZXX_Busi_Manage/ZXX_RefrushBillLaborDepositData', param);

// 查询利润留存报表
export const GetProfitList = param => request('/ZXX_Busi_Manage/GetProfitList', param);

// 导出利润留存报表
export const ExportProfitList = param => request('/ZXX_Busi_Manage/ExportProfitList', param);

// 更新利润Comment内容
export const UpdateProfitComment = param => request('/ZXX_Busi_Manage/UpdateProfitComment', param);

//  查询Z盈利报表中介费
export const GetAgentBillDetailForZProfit = param => request('/ZXX_Busi_Manage/GetAgentBillDetailForZProfit', param);

// 查询Z盈利报表服务费
export const GetPlatformBillDetailForZProfit = param => request('/ZXX_Busi_Manage/GetPlatformBillDetailForZProfit', param);

// 导出Z盈利报表中介费
export const ExportAgentBillDetailForZProfit = param => request('/ZXX_Busi_Manage/ExportAgentBillDetailForZProfit', param);

// 导出Z盈利报表服务费
export const ExportPlatformBillDetailForZProfit = param => request('/ZXX_Busi_Manage/ExportPlatformBillDetailForZProfit', param);

// 异步获取结果
export const getResByBizID = param => request('/ZXX_Busi_Manage/GetExportResult', param);
// 修改Z调整金额
export const updataAdjustProfitData = param => request('/ZXX_Busi_Manage/ModifyAdjustAmtForZ', param);
// 修改ZX调整金额
export const updataAdjustProfitXData = param => request('/ZXX_Busi_Manage/ModifyAdjustAmtForZX', param);
