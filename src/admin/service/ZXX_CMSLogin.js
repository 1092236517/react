import request from 'ADMIN_UTILS/httpRequest';

export const webLogin = param => request('/ZXX_CMSLogin/ZXX_LOGIN_CMSLogin', param);