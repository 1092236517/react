import request from 'ADMIN_UTILS/httpRequest';

//  周薪数据
export const listWeekSalary = param => request('/ZXX_KanBan/WeeklySalaryData', param);

//  周薪数据详情
export const listWeekSalaryDetail = param => request('/ZXX_KanBan/WeeklySalaryDataDetail', param);

//  打卡人数
export const listClock = param => request('/ZXX_KanBan/ClockPersonCount', param);

//  打卡人数详情
export const listClockDetail = param => request('/ZXX_KanBan/ClockPersonDetail', param);

//  月薪发薪预报
export const previewMonthSalary = param => request('/ZXX_KanBan/MonthlySalaryPerView', param);

//  在职天数查询
export const InWorkDaysSelect = param => request('/ZXX_KanBan/InWorkDaysSelect', param);

//  在职天数查询(周期查询)
export const InWorkDaysByCycleSelect = param => request('/ZXX_KanBan/InWorkDaysByCycleSelect', param);

//  留存率
export const listZXXReten = param => request('/ZXX_KanBan/RetentionRate', param);

//  留存率入职率
export const interviewerRetentionRate = param => request('/ZXX_KanBan/InterviewerRetentionRate', param);