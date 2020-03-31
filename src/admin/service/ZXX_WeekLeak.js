import request from 'ADMIN_UTILS/httpRequest';
// 不发周月薪查漏查询
export const NoWeekBillLeakOut = param => request('/ZXX_WeekLeak/NoWeekBillLeakOut', param);

// 不发周月薪查漏导出
export const NoWeekBillLeakOutExport = param => request('/ZXX_WeekLeak/NoWeekBillLeakOutExport', param);

// 周薪查漏处理
export const LeakHandle = param => request('/ZXX_WeekLeak/LeakHandle', param);

// 周薪查漏导出
export const exportWeeklyWageLeakList = param => request('/ZXX_WeekLeak/LeakOutExport', param);

// 周薪查漏查询
export const getWeeklyWageLeakList = param => request('/ZXX_WeekLeak/LeakOutSelect', param);
