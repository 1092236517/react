const ZXX_Authority_MOCK = require('./mock/ZXX_Authority.mock');
const ZXX_CMSLogin_MOCK = require('./mock/ZXX_CMSLogin.mock');
const VCodeManager_MOCK = require('./mock/VCodeManager.mock');
const ZXX_NameManager_MOCK = require('./mock/ZXX_NameManager.mock'); // 名单管理
const ZXX_OrderManager_MOCK = require('./mock/ZXX_OrderManager.mock'); // 订单管理
const ZXX_MonthBill = require('./mock/ZXX_MonthBill.mock');
const ZXX_WeekBill = require('./mock/ZXX_WeekBill.mock');
const ZXX_BaseData = require('./mock/ZXX_BaseData.mock');
const ZXX_WithdrawMgr = require('./mock/ZXX_WithdrawMgr.mock');
const ZXX_QueryIDCardInfo = require('./mock/ZXX_UserInformationQuery.mock'); // 用户信息查询
const ZXX_Remit_QueryApply = require('./mock/ZXX_Remit_QueryApply.mock'); // 发薪申请
const ZXX_Remit_QueryAudit = require('./mock/ZXX_Remit_QueryAudit.mock'); // 授权
const ZXX_Remit_QueryReAudit = require('./mock/ZXX_Remit_QueryReAudit.mock'); // 重发授权
const ZXX_FundAduj_GetList = require('./mock/ZXX_FundAduj_GetList.mock'); // 出入金列表
const ZXX_WeekBillGen = require('./mock/ZXX_WeekBillGen.mock'); 
const ZXX_MonthBillGen = require('./mock/ZXX_MonthBillGen.mock'); 
const ZXX_RiskFund = require('./mock/ZXX_RiskFund.mock'); 

module.exports = [
    ...ZXX_Authority_MOCK,
    ...ZXX_CMSLogin_MOCK,
    ...VCodeManager_MOCK,
    ...ZXX_MonthBill,
    ...ZXX_WeekBill,
    ...ZXX_BaseData,
    ...ZXX_WithdrawMgr,
    ...ZXX_NameManager_MOCK, // 名单管理
	...ZXX_OrderManager_MOCK, // 订单管理
	...ZXX_QueryIDCardInfo, // 用户信息查询
    ...ZXX_Remit_QueryApply,
    ...ZXX_Remit_QueryAudit,
    ...ZXX_Remit_QueryReAudit,
    ...ZXX_FundAduj_GetList,
    ...ZXX_WeekBillGen,
    ...ZXX_MonthBillGen,
    ...ZXX_RiskFund
];
