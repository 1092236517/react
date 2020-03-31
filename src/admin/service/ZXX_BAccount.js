import request from 'ADMIN_UTILS/httpRequest';

// B端账户管理

// 劳务账户---劳务列表
export const GetLabourList = param => request('/ZXX_PayOff/ZXX_PayOff_Apply', param);

// 劳务账号---劳务账户详细列表
export const GetLabourAccountDetailList = param => request('/ZXX_PayOff/ZXX_PayOff_Apply', param);

// 劳务账户---劳务单条账户详细信息
export const GetLabourSingleDetailInfo = param => request('/ZXX_PayOff/ZXX_PayOff_Apply', param);

// 劳务账户---导出
export const LabourExport = param => request('/ZXX_PayOff/ZXX_PayOff_Apply', param);

// 中介账户---中介列表
export const GetAgencyList = param => request('/ZXX_PayOff/ZXX_PayOff_Apply', param);

// 中介账户---中介账户详细列表
export const GetAgencyAccountDetailList = param => request('/ZXX_PayOff/ZXX_PayOff_Apply', param);

// 中介账户---中介单条账户详细信息
export const GetAgencySingleDetailInfo = param => request('/ZXX_PayOff/ZXX_PayOff_Apply', param);

// 中介账户---导出
export const AgencyExport = param => request('/ZXX_PayOff/ZXX_PayOff_Apply', param);


// 出入金管理---出入金列表
export const GetEntryAndExitList = param => request('/ZXX_PayOff/ZXX_PayOff_Apply', param);

// 出入金管理---申请
export const Apply = param => request('/ZXX_PayOff/ZXX_PayOff_Apply', param);

// 出入金管理---审核
export const Examined = param => request('/ZXX_PayOff/ZXX_PayOff_Apply', param);

// 出入金管理---查看
export const Check = param => request('/ZXX_PayOff/ZXX_PayOff_Apply', param);

// 到账出账明细--列表
export const getentryAndExitDetailList = param => request('/ZXX_FundAduj/GetSplitList', param);
// 导出 到账出账明细--列表
export const expDataList = param => request('/ZXX_FundAduj/ExportSplitList', param);



