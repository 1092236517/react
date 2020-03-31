import request from 'ADMIN_UTILS/httpRequest';

export const getSercetKey = param => request('/Aliyun/WD_ALI_GetAliSTS', param);