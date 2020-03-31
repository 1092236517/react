import request from 'ADMIN_UTILS/httpRequest';

// 所有三方数据，企业 劳务 中介
export const getAllCompanyInfo = param => request('/ZXX_BaseData/ZXX_GetAllCompanyInfo', param);
// 获取企业数据列表
export const companyQueryInfoLisit = param => request('/ZXX_BaseData/ZXX_CompanyQueryInfoLisit', param);

// 同步企业数据
export const syncCompanyInfo = param => request('/ZXX_BaseData/ZXX_SyncCompanyInfo', param);
// 同步企业数据
export const editCompanyInfo = param => request('/ZXX_BaseData/ZXX_EditCompanyInfo', param);

// 获取中介 劳务
export const getAgentLaborList = param => request('/ZXX_BaseData/ZXX_AgentQueryInfoList', param);

// 编辑中介 劳务
export const editAgentLabor = param => request('/ZXX_BaseData/ZXX_EditAgentInfo', param);

// 同步中介 劳务
export const syncAgentLabor = param => request('/ZXX_BaseData/ZXX_SyncAgentInfo', param);


//  修改付款账号
export const updateBankPayAcct = param => request('/ZXX_BaseData/ZXX_UpdatePayAccnt', param);
//  启用/停用付款账号
export const ableBankPayAcct = param => request('/ZXX_BaseData/ZXX_AblePayAccnt', param);
//  新增付款账号
export const addBankPayAcct = param => request('/ZXX_BaseData/ZXX_AddPayAccnt', param);
//  查询付款账号
export const getBankPayAcct = param => request('/ZXX_BaseData/ZXX_QueryPayAccnt', param);
//  获取所有付款账号
export const getAllBankPayAcct = param => request('/ZXX_BaseData/ZXX_GetAllPayAccnt', param);

//  新增会员打款虚拟子账户
export const addMemberPayAcct = param => request('/ZXX_BaseData/ZXX_AddUserPayAccntRouter', param);
//  更新会员打款虚拟子账户
export const updateMemberPayAcct = param => request('/ZXX_BaseData/ZXX_UpdateUserPayAccntRouter', param);
//  查询会员打款虚拟子账户
export const getMemberPayAcct = param => request('/ZXX_BaseData/ZXX_QueryUserPayAccntRouter', param);
//  导出会员打款虚拟子账户
export const expMemberPayAcct = param => request('/ZXX_BaseData/ZXX_ExportUserPayAccntRouter', param);


//  新增中介打款虚拟子账号
export const addAgentPayAcct = param => request('/ZXX_BaseData/ZXX_AddAgentPayAccntRouter', param);
//  更新中介打款虚拟子账号
export const updateAgentPayAcct = param => request('/ZXX_BaseData/ZXX_UpdateAgentPayAccntRouter', param);
//  查询中介打款虚拟子账户
export const getAgentPayAcct = param => request('/ZXX_BaseData/ZXX_QueryAgentPayAccntRouter', param);

//  企业对应劳务-添加 
export const addEntLaborMap = param => request('/ZXX_BaseData/ZXX_AddBillEnterLaborMap', param);

//  企业对应劳务-查询 
export const listEntLaborMap = param => request('/ZXX_BaseData/ZXX_GetBillEnterLaborMapList', param);

//  更新劳务押金关系
export const editLaborDepoMap = param => request('/ZXX_BaseData/ZXX_UpdateLaborDepositRelation', param);

//  查询劳务押金关系列表 
export const listLaborDepoMap = param => request('/ZXX_BaseData/ZXX_GetLaborDepositRelationList', param);

//  查询大佬列表 
export const listBoss = param => request('/ZXX_BaseData/ZXX_GetBossList', param);

//  添加劳务押金关系
export const addLaborDepoMap = param => request('/ZXX_BaseData/ZXX_AddLaborDepositRelation', param);

//  查询发票
export const listInvoice = param => request('/ZXX_BaseData/InvoiceSelect', param);

//  导出开票信息
export const exportinvoiceList = param => request('/ZXX_BaseData/InvoiceExport', param);

//  审核发票
export const auditInvoice = param => request('/ZXX_BaseData/InvoiceAudit', param);

//  添加发票
export const addInvoice = param => request('/ZXX_BaseData/InvoiceAdd', param);

//  是否可以添加发票
export const canAddInvoice = param => request('/ZXX_BaseData/InvoiceAddJudge', param);

//  查看发票历史
export const historyInvoice = param => request('/ZXX_BaseData/InvoiceHistory', param);

//  添加劳务押金关系
export const editInvoice = param => request('/ZXX_BaseData/InvoiceEdit', param);

//  添加劳务押金关系
export const getRebateForecastReport = param => request('/ZXX_ReturnFeeBill/ZXX_ReturnFee_RetrunFee_Predict_Select', param);


//  导出zx盈利分析明细
export const exportProfitDetail = param => request('/ZXX_Busi_Manage/ExportProfitDetailForZX', param);

//  获取zx盈利分析明细列表数据
export const getProfitDetail = param => request('/ZXX_Busi_Manage/GetProfitDetailForZX', param);

//  获取zx盈利分析总报表
export const getZxProfitSummary = param => request('/ZXX_Busi_Manage/GetZxProfitSummary', param);

//  自离工资分析报表
export const getQuitSalaryAnalysis = param => request('/ZXX_Busi_Manage/GetQuitSalaryAnalysis', param);
//  更新企业劳务月薪发放方式
export const modifyPayType = param => request('/ZXX_BaseData/ModifySalaryPlayer', param);


//  是否已发月薪
export const updataRowRecord = param => request('/ZXX_BaseData/ZXX_UpdatePayProgress', param);
//  查询月薪发放进度列表
export const getMonthyWagePaySetList = param => request('/ZXX_BaseData/ZXX_GetPayProgressList', param);
//  添加月薪发放提醒接收人
export const addRemindReceiver = param => request('/ZXX_BaseData/ZXX_AddRemindReceiver', param);
//  修改月薪发放提醒接收人
export const updateRemindReceiver = param => request('/ZXX_BaseData/ZXX_UpdateRemindReceiver', param);
//  查询月薪发放接收人列表
export const getRemindReceiverList = param => request('/ZXX_BaseData/ZXX_GetRemindReceiverList', param);

//  删除劳务押金关系
export const deleteLaborDepoMap = param => request('/ZXX_BaseData/DeleteLaborDepositeRelation', param);
//  导出返费预测表
export const exportRebateForecastReport = param => request('/ZXX_ReturnFeeBill/ZXX_ReturnFee_RetrunFee_Predict_Export', param);
//  获取返费预测表结果
export const getRebateForecastReportList = param => request('/ZXX_ReturnFeeBill/ZXX_ReturnFee_GetExportResult', param);
