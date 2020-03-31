import request from 'ADMIN_UTILS/httpRequest';

// 打卡记录导出
export const importClock = param => request('/ZXX_Clock/ZXX_Clock_ExportRecord', param);

// 获取打卡记录列表
export const getClockList = param => request('/ZXX_Clock/ZXX_Clock_QueryRecord', param);

// 新建打卡记录
export const repairClock = param => request('/ZXX_Clock/ZXX_Clock_RepairClock', param);

// 根据身份获取个人信息
export const getWorkInfo = param => request('/ZXX_Clock/ZXX_Clock_GetWorkInfo', param);

//  打卡统计导出
export const exportClockStatistic = param => request('/ZXX_Clock/ZXX_Clock_ExportReportForm', param);

//  打卡统计
export const getClockStatistic = param => request('/ZXX_Clock/ZXX_Clock_QueryReportForm', param);

//  获取最大补卡次数
export const getMaxReissueCount = param => request('/ZXX_Clock/ZXX_Clock_GetMaxReissueCount', param);

//  设置最大补卡次数
export const setMaxReissueCount = param => request('/ZXX_Clock/ZXX_Clock_SetMaxReissueCount', param);

//  通过工牌号码获取企业名单(简称)列表
export const getEntByWorkCard = param => request('/ZXX_Clock/ZXX_Clock_EntByWorkCard', param);

//  简化版补卡
export const reissueClock = param => request('/ZXX_Clock/ZXX_Clock_ReissueClock', param);
