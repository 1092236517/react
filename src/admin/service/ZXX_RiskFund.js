import request from 'ADMIN_UTILS/httpRequest';

export const listRiskFund = param => request('/ZXX_RiskFund/SelectRiskFund', param);

export const expRiskFund = param => request('/ZXX_RiskFund/ExportRiskFund', param);