import request from 'ADMIN_UTILS/httpRequest';

// 获取出入金列表
export const GetList = param => request('/ZXX_FundAduj/ZXX_FundAduj_GetList', param);

// 出⼊⾦审批
export const Audit = param => request('/ZXX_FundAduj/ZXX_FundAduj_Audit', param);

// 出入金申请
export const Request = param => request('/ZXX_FundAduj/ZXX_FundAduj_Request', param);

// 获取单个出入金记录
export const GetByID = param => request('/ZXX_FundAduj/ZXX_FundAduj_GetByID', param);

// 获取服务商资金账户基本信息
export const GetAccoutInfoBySPID = param => request('/ZXX_FundAduj/ZXX_FundAduj_GetAccoutInfoBySPID', param);

// 获取催款列表
export const GetDunningList = param => request('/ZXX_FundAduj/ZXX_FundAduj_GetDunningList', param);

// 单个出入金拆分
export const SplitById = param => request('/ZXX_FundAduj/ZXX_FundAduj_SplitById', param);

// 催款列表导出
export const ExportDunningList = param => request('/ZXX_FundAduj/ZXX_FundAduj_ExportDunningList', param);

// 导出出入金列表
export const ExportList = param => request('/ZXX_FundAduj/ZXX_FundAduj_ExportList', param);

// 导入出入金申请Excel
export const ImportPreview = param => request('/ZXX_FundAduj/ImportPreview', param);

// 未审核前查看详细列表可以编辑
export const FundAdujEdit = param => request('/ZXX_FundAduj/FundAdujEdit', param);
// 保存虚拟账户数据
export const SaveVmData = param => request('/ZXX_FundAduj/DepositConvert', param);
// 红冲
export const requestRedRush = param => request('/ZXX_FundAduj/ZXX_FundAduj_RequestRedRush', param);


