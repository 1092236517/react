import request from 'ADMIN_UTILS/httpRequest';

//  返费申请-查询
export const listMemberApply = param => request('/ZXX_ReturnFeeBill/ZXX_ReturnFee_RetrunFee_Apply_Select', param);

//  返费申请-审核
export const auditMemberApply = param => request('/ZXX_ReturnFeeBill/ZXX_ReturnFee_Apply_Audit', param);

//  返费申请-作废原因编辑
export const editDestroyReas = param => request('/ZXX_ReturnFeeBill/ZXX_ReturnFee_Modify_CancelRemark', param);

//  返费账单-审核
export const auditBill = param => request('/ZXX_ReturnFeeBill/ZXX_ReturnFee_Bill_Audit', param);

//  返费账单-查询
export const listBill = param => request('/ZXX_ReturnFeeBill/ZXX_ReturnFee_RetrunFee_Bill_Select', param);

//  返费账单-导出
export const exportBill = param => request('/ZXX_ReturnFeeBill/ZXX_ReturnFee_RetrunFee_Bill_Export', param);

//  返费账单-状态更新（打款状态）
export const editBillTransferSts = param => request('/ZXX_ReturnFeeBill/ZXX_ReturnFee_Bill_Status_Update_Transfer', param);

//  返费账单-状态更新（是否已发劳务）
export const editBillHasSendLabor = param => request('/ZXX_ReturnFeeBill/ZXX_ReturnFee_Bill_Status_Update_IsSend', param);

//  返费申请-税额已发劳务
export const taxHasToTrgt = param => request('/ZXX_ReturnFeeBill/TaxHasToTrgt', param);

//  返费申请
export const exportMemberApply = param => request('/ZXX_ReturnFeeBill/ZXX_ReturnFee_RetrunFee_Apply_Export', param);

//  批量更新备注
export const saveMarkRecord = param => request('/ZXX_ReturnFeeBill/UpdateBillRemark', param);

// 返费申请导入
export const returnApplicationImport = param => request('/ZXX_ReturnFeeBill/ImportReturnFee', param);

