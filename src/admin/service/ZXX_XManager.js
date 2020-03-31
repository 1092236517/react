import request from 'ADMIN_UTILS/httpRequest';

//  a的中介费配置-查询
export const listConfigAgentA = param => request('/ZXX_XManager/ZXX_XManager_AConfigure_Select', param);
//  a的中介费配置-审核
export const auditConfigAgentA = param => request('/ZXX_XManager/ZXX_XManager_AConfigure_Audit', param);
//  a的中介费配置-添加
export const addConfigAgentA = param => request('/ZXX_XManager/ZXX_XManager_AConfigure_Create', param);
//  a的中介费配置-修改
export const editConfigAgentA = param => request('/ZXX_XManager/ZXX_XManager_AConfigure_InfoEdit', param);

//  X项配置-查询
export const listConfigX = param => request('/ZXX_XManager/ZXX_XManager_XConfigure_Select', param);
//  X项配置-审核
export const auditConfigX = param => request('/ZXX_XManager/ZXX_XManager_XConfigure_Audit', param);
//  X项配置-添加
export const addConfigX = param => request('/ZXX_XManager/ZXX_XManager_XConfigure_Create', param);
//  X项配置-修改
export const editConfigX = param => request('/ZXX_XManager/ZXX_XManager_XConfigure_InfoEdit', param);

// X查漏个人-列表
export const GetByPeople = param => request('/ZXX_XManager/ZXX_XManager_XLeak_GetByPeople', param);
// X查漏个人-导出
export const ExportByPeople = param => request('/ZXX_XManager/ZXX_XManager_XLeak_ExportByPeople', param);
// X查漏个人-导出所有
export const exportAllPeople = param => request('/ZXX_XManager/ZXX_XManager_XLeak_ExportAllByPeople', param);
// X查漏X项-列表
export const GetStatics = param => request('/ZXX_XManager/ZXX_XManager_XLeak_GetStatics', param);
// X查漏X项-导出
export const ExportStatics = param => request('/ZXX_XManager/ZXX_XManager_XLeak_ExportStatics', param);
// X查漏X项-修改缺
export const ModifyLeak = param => request('/ZXX_XManager/ZXX_XManager_XLeak_ModifyLeak', param);

//  导入X-导入时获取可用xType 
export const getAvaliableXTypes = param => request('/ZXX_XManager/ZXX_XManager_GetAvaliableXTypes', param);
//  导入X-审核
export const auditImpX = param => request('/ZXX_XManager/ZXX_XManager_XGen_Audit', param);
//  导入X-导出详情 
export const exportImpXDetails = param => request('/ZXX_XManager/ZXX_XManager_XGen_ExportDetailList', param);
//  导入x-异步查询结果
export const getExpRes = param => request('/ZXX_XManager/ZXX_XManager_GetExportResult', param);
//  导入X-导出预览
export const exportImpXPre = param => request('/ZXX_XManager/ZXX_XManager_XGen_ExportPreview', param);
//  导入X-提交保存
export const generateBatchImpX = param => request('/ZXX_XManager/ZXX_XManager_XGen_GenerateBatch', param);
//  导入X-查询
export const listImpX = param => request('/ZXX_XManager/ZXX_XManager_XGen_GetDetailList', param);
//  导出X-查询提交结果   
export const getResGeneBatch = param => request('/ZXX_XManager/ZXX_XManager_XGen_GetGenerateBatchResult', param);
//  导出X-导入检查
export const checkImpX = param => request('/ZXX_XManager/ZXX_XManager_XGen_ImportCheck', param);
//  导出X-查询导入检查结果
export const getResCheckImpX = param => request('/ZXX_XManager/ZXX_XManager_XGen_GetImportCheckResult', param);

//  导出X-删除
export const delImpX = param => request('/ZXX_XManager/ZXX_XManager_XGen_Delete', param);

// X汇总-查询
export const GetXSummary = param => request('/ZXX_XManager/ZXX_XManager_GetXSummary', param);
// X汇总-修改
export const ModifyXSummary = param => request('/ZXX_XManager/ZXX_XManager_ModifyXSummary', param);
// X汇总-审核
export const AuditXSummary = param => request('/ZXX_XManager/ZXX_XManager_AuditXSummary', param);

//  ZX结算明细  
export const listSettleDetail = param => request('/ZXX_XManager/ZXX_XManager_Settle_GetDetail', param);
// ZX结算汇总
export const SettleGetSummary = param => request('/ZXX_XManager/ZXX_XManager_Settle_GetSummary', param);
// ZX结算汇总-处理
export const DealXSummary = param => request('/ZXX_XManager/ZXX_XManager_DealXSummary', param);