import request from 'ADMIN_UTILS/httpRequest';

// 查询申请列表
export const QueryApply = param => request('/ZXX_Remit/ZXX_Remit_QueryApply', param);

// 创建申请
export const CreateApply = param => request('/ZXX_Remit/ZXX_Remit_CreateApply', param);

// 查询授权列表
export const QueryAudit = param => request('/ZXX_Remit/ZXX_Remit_QueryAudit', param);

// 查询重发授权申请
export const QueryReAudit = param => request('/ZXX_Remit/ZXX_Remit_QueryReAudit', param);

// 发薪授权
export const Audit = param => request('/ZXX_Remit/ZXX_Remit_Audit', param);

// 重发授权申请授权操作
export const ReAudit = param => request('/ZXX_Remit/ZXX_Remit_ReAudit', param);

// 删除申请
export const DeleteApply = param => request('/ZXX_Remit/ZXX_Remit_DeleteApply', param);

// 修改申请
export const UpdateApply = param => request('/ZXX_Remit/ZXX_Remit_UpdateApply', param);

//  发薪申请提交授权
export const submitAudit = param => request('/ZXX_Remit/Submit_Audit', param);