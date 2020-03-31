import request from 'ADMIN_UTILS/httpRequest';

// 发薪申请列表
export const PayOffApply = param => request('/ZXX_PayOff/ZXX_PayOff_Apply', param);

// 发薪申请新增
export const AddApplyData = param => request('/ZXX_PayOff/ZXX_PayOff_AddApplyData', param);

// 发薪申请修改
export const ModefiyApplyData = param => request('/ZXX_PayOff/ZXX_PayOff_ModefiyApplyData', param);

// 发薪申请删除
export const DeleteApplyData = param => request('/ZXX_PayOff/ZXX_PayOff_DeleteApplyData', param);

// 确认授权
export const Confirm = param => request('/ZXX_PayOff/ZXX_PayOff_Confirm', param);

