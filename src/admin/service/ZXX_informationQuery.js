import request from 'ADMIN_UTILS/httpRequest';

// 身份证信息查询
// 导出身份证信息列表
export const iDCardInfoListExport = param => request('/ZXX_Audit/ZXX_IDCardInfoListExport', param);

// 查询身份证信息列表
export const queryIDCardInfoList = param => request('/ZXX_Audit/ZXX_QueryIDCardInfoList', param);

// 身份证图片看不清
export const getNextIDCardPic = param => request('/ZXX_Audit/ZXX_GetNextIDCardPic', param);


// 身份证信息审核
export const auditIDCard = param => request('/ZXX_Audit/ZXX_AuditIDCard', param);

// 银行卡信息查询
// 修改银行卡可用状态
export const modifyBankCardStatus = param => request('/ZXX_Audit/ZXX_ModifyBankCardStatus', param);

// 导出银行卡信息列表
export const bankCardInfoListExport = param => request('/ZXX_Audit/ZXX_BankCardInfoListExport', param);

// 查询银行卡信息列表
export const queryBankCardInfoList = param => request('/ZXX_Audit/ZXX_QueryBankCardInfoList', param);

// 获取下一张银行卡图片
export const getNextBankCardPic = param => request('/ZXX_Audit/ZXX_GetNextBankCardPic', param);

// 银行卡信息审核
export const auditBankCard = param => request('/ZXX_Audit/ZXX_AuditBankCard', param);

// 工牌信息查询
// 导出工牌信息列表
export const workCardInfoListExport = param => request('/ZXX_Audit/ZXX_WorkCardInfoListExport', param);

// 工牌信息审核
export const auditWorkCard = param => request('/ZXX_Audit/ZXX_AuditWorkCard', param);

// 查询工牌信息列表
export const queryWorkCardInfoList = param => request('/ZXX_Audit/ZXX_QueryWorkCardInfoList', param);

// 获取下一张工牌图片
export const getNextWorkCardPic = param => request('/ZXX_Audit/ZXX_GetNextWorkCardPic', param);