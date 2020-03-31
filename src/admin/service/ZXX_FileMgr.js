import request from 'ADMIN_UTILS/httpRequest';

export const listFile = param => request('/ZXX_FileMgr/ZXX_FileMgr_GetList', param);

export const addFile = param => request('/ZXX_FileMgr/ZXX_FileMgr_Add', param);

export const editFile = param => request('/ZXX_FileMgr/ZXX_FileMgr_Edit', param);

export const auditFile = param => request('/ZXX_FileMgr/ZXX_FileMgr_Audit', param);