import request from 'ADMIN_UTILS/httpRequest';

// app支付接口查询
export const getXXCPayResult = param => request('/ZXX_AppPay/GetXXCPayResult', param);

// 导出
export const exportXXCPayResult = param => request('/ZXX_AppPay/ExportXXCPayResult', param);
