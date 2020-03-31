import request from 'ADMIN_UTILS/httpRequest';

// 银行卡信息修改
export const ModifyBankCardParam = param => request('/ZXX_Audit/ZXX_ModifyBankCardParam', param);

// 工牌信息修改
export const ModifyWorkCardNo = param => request('/ZXX_Audit/ZXX_ModifyWorkCardNo', param);

// 身份证审核状态刷新
export const CmsIdCardQuery = param => request('/ZXX_Audit/ZXX_CmsIdCardQuery', param);

// 银行卡审核状态刷新
export const CmsBankCardQuery = param => request('/ZXX_Audit/ZXX_CmsBankCardQuery', param);