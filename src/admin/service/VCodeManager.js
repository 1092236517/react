import request from 'ADMIN_UTILS/httpRequest';

// 获取验证码
export const getVCode = param => request('/VCodeManager/GetVCode', param);