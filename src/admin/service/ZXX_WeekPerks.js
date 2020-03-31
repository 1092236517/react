import request from 'ADMIN_UTILS/httpRequest';

//  导入检查
export const importWeeklyPerksCheck = param => request('/ZXX_WeekBillGen/ZXX_WeekBillGen_SubsidyImportCheck', param);

//  查询导入周返费检查结果
export const exportPreview = param => request('/ZXX_WeekBillGen/ZXX_WeekBillGen_SubsidyExportPreview', param);

//  查询结果
export const getSbsidyGetImportResult = param => request('/ZXX_WeekBillGen/ZXX_WeekBillGen_SubsidyGetImportResult', param);
