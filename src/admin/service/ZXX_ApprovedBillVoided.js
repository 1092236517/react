import request from 'ADMIN_UTILS/httpRequest';

export const deleteBill = param => request('/ZXX_SettlementManager/DeleteBill', param);
