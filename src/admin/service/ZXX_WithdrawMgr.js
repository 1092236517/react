import request from 'ADMIN_UTILS/httpRequest';

//  作废银行退回
export const destroyBankBack = param => request('/ZXX_WithdrawMgr/ZXX_WithdrawMgr_DestroyBankBack', param);
//  执行打款
export const withDrawPay = param => Promise.race([request('/ZXX_WithdrawMgr/ZXX_WithdrawMgr_Pay', param), (new Promise((resolve, reject) => {
    setTimeout(reject.bind(this, new Error('TIMEOUT')), 10000);
}))]);

//  申请重新打款  
export const withDrawRePay = param => request('/ZXX_WithdrawMgr/ZXX_WithdrawMgr_RequestRePay', param);

//  获取会员的交易列表  
export const getUserTradeList = param => request('/ZXX_WithdrawMgr/ZXX_WithdrawMgr_GetUserTradeList', param);

//  获取会员的打款详单  
export const getUserTradeDetail = param => request('/ZXX_WithdrawMgr/ZXX_WithdrawMgr_GetUserTradeDetail', param);

//  获取打款明细列表  
export const getWithdrawDetailList = param => request('/ZXX_WithdrawMgr/ZXX_WithdrawMgr_GetWithdrawDetailList', param);

//  获取打款明细列表(导出)
export const exportWithdrawDetailList = param => request('/ZXX_WithdrawMgr/ZXX_WithdrawMgr_ExportWithdrawDetailList', param);

//  获取银行退回列表  
export const getBankBackList = param => request('/ZXX_WithdrawMgr/ZXX_WithdrawMgr_GetBankBackList', param);

//  获取银行退回列表(导出)
export const exportBankBackList = param => request('/ZXX_WithdrawMgr/ZXX_WithdrawMgr_ExportBankBackList', param);

//  设置打款失败  
export const setToMoneyFail = param => request('/ZXX_WithdrawMgr/ZXX_WithdrawMgr_SetToMoneyFail', param);

//  获取导出结果 
export const getWithdrawExportRes = param => request('/ZXX_WithdrawMgr/ZXX_WithdrawMgr_GetExportResult', param);