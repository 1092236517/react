import request from 'ADMIN_UTILS/httpRequest';

// 银行名称
export const getBankList = param => request('/ZXX_SystemCfg/BankList', param);

// 公告推送管理列表查询
export const getPushList = param => request('/ZXX_UserMsgCenter/PigMsgSelect', param);

// 获取会员列表
export const getReceiveMember = param => request('/ZXX_UserMsgCenter/PigMsgSelect', param);
// 保存导入的表格数据信息
export const saveImportData = param => request('/ZXX_UserMsgCenter/UserSelectImport', param);
// 保存推送公告
export const saveNoticeData = param => request('/ZXX_UserMsgCenter/PicMsgAdd', param);
// 修改推送公告
export const modifyNoticeData = param => request('/ZXX_UserMsgCenter/PicMsgEdit', param);
// 条件筛选会员
export const getMemberByFilter = param => request('/ZXX_UserMsgCenter/UserSelectByParam', param);
// 查看会员详情列表
export const getMemberSelectDetail = param => request('/ZXX_UserMsgCenter/UserSelectDetail', param);



