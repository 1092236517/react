import history from 'ADMIN/routes/history';
import HomeStore from './HomeStore';
import AuthStore from './AuthStore';
import GlobalStore from './GlobalStore';
import IdCardStore, { View as idCardView } from './informationQuery/idCardStore'; // 身份证信息查询
import BankCardStore, { View as bankCardView } from './informationQuery/bankCardStore'; // 银行卡信息查询
import WorkCardStore, { View as workCardView } from './informationQuery/workCardStore'; // 工牌信息查询
import BankCardExmportStore, { View as BankCardExmportView } from './informationQuery/bankCardExmportStore'; // 银行卡信息拉取
import CompanyStore, { View as companyView } from './basicData/companyStore'; // 企业基础数据
import CompanyEditStore, { View as companyEditView } from './basicData/companyEditStore'; // 企业基础数据
import LabarStore, { View as labarView } from './basicData/labarStore'; // 劳务基础数据
import IntermediaryAgentStore, { View as intermediaryAgentView } from './basicData/intermediaryAgentStore'; // 中介基础数据
import PtResourceStore, { View as PtResourceView } from './systemManager/ptResourceStore';
import PtRoleStore, { View as PtRoleView } from './systemManager/ptRoleStore';
import UserManagerStore, { View as userManagerView } from './systemManager/userManager';
import ApplyStore, { View as ApplyView } from './payOffManager/applyStore';
import AuthorizationStore, { View as AuthorizationView } from './payOffManager/authorizationStore';
import ReAuthorizationStore, { View as ReAuthorizationView } from './payOffManager/reAuthorizationStore';
import AgencyAccountStore, { View as AgencyAccountView } from './bAccountManager/agencyAccountStore';
import EntryAndExitStore, { View as EntryAndExitView } from './bAccountManager/entryAndExitStore';
import EntryAndExitDetailStore, { View as EntryAndExitDetailView } from './bAccountManager/entryAndExitDetailStore';
import LabourAccountStore, { View as LabourAccountView } from './bAccountManager/labourAccountStore';
import ListStore, { View as listView } from './orderlist/listStore'; // 名单管理
import OrderStore, { View as orderView } from './orderlist/orderStore'; // 订单管理
import ClockInMagStore, { View as clockInMagView } from './clockInManager/clockInMagStore'; // 打卡记录管理
import WeeklyWageBillStore, { View as WeeklyWageBillView } from './weeklyWageManager/weeklyWageBillStore';
import WeeklyWageBillDetailStore, { View as WeeklyWageBillDetailView } from './weeklyWageManager/weeklyWageBillDetailStore';
import WeeklyWageImportStore, { View as WeeklyWageImportView } from './weeklyWageManager/weeklyWageImportStore';
import WeeklyWagePerksStore, { View as WeeklyWagePerksView } from './weeklyWageManager/weeklyWagePerksStore';
import WeeklyWageImportRecordStore, { View as WeeklyWageImportRecordView } from './weeklyWageManager/weeklyWageImportRecordStore';
import DeparturePredictStore, { View as DeparturePredictView } from './weeklyWageManager/departurePredictStore';
import WeeklyWageListStore, { View as WeeklyWageListView } from './weeklyWageManager/weeklyWageListStore';
import WeeklyWageReissueStore, { View as WeeklyWageReissueView } from './weeklyWageManager/weeklyWageReissueStore';
import MonthlyWageBillStore, { View as MonthlyWageBillView } from './monthlyWageManager/monthlyWageBillStore';
import MonthlyWageBillDetailStore, { View as MonthlyWageBillDetailView } from './monthlyWageManager/monthlyWageBillDetailStore';
import MonthlyWageImportStore, { View as MonthlyWageImportView } from './monthlyWageManager/monthlyWageImportStore';
import MonthlyWageImportRecordStore, { View as MonthlyWageImportRecordView } from './monthlyWageManager/monthlyWageImportRecordStore';
import MonthlyWageListStore, { View as MonthlyWageListView } from './monthlyWageManager/monthlyWageListStore';
import MonthlyWageReissueStore, { View as MonthlyWageReissueView } from './monthlyWageManager/monthlyWageReissueStore';
import WithdrawManagerPayStore, { View as WithdrawManagerPayView } from './withdrawManager/withdrawManagerPayStore';
import WithdrawManagerBackStore, { View as WithdrawManagerBackView } from './withdrawManager/withdrawManagerBackStore';
import BankPayAcctStore, { View as BankPayAcctView } from './basicData/bankPayAccountStore';
import AgentPayAccounttStore, { View as AgentPayAccountView } from './basicData/agentPayAccountStore';
import MemberPayAccountStore, { View as MemberPayAccountView } from './basicData/memberPayAccountStore';
import PlatformProfitStore, { View as PlatformProfitView } from './bAccountManager/platformProfitStore';
import ClockStatisticStore, { View as ClockStatisticView } from './clockInManager/clockStatisticStore';
import DunningListStore, { View as DunningListView } from './bAccountManager/dunningListStore';
import WeeklyWageLeakStore, { View as WeeklyWageLeakStoreView } from './weeklyWageManager/weeklyWageLeakStore';
import MissInfoListStore, { View as MissInfoListView } from './weeklyWageManager/missInfoListStore';
import ProfitStoreOld, { View as ProfitViewOld } from './bAccountManager/profitStoreOld';
import ProfitStore, { View as ProfitView } from './bAccountManager/profitStore';
import ConfigAgentAStore, { View as ConfigAgentAView } from './settleMgr/configAgentAStore';
import ConfigXStore, { View as ConfigXView } from './settleMgr/configXStore';
import ImportXListStore, { View as ImportXListView } from './settleMgr/importXListStore';
import ImportXStore, { View as ImportXView } from './settleMgr/importXStore';
import LeakOutPersonStore, { View as LeakOutPersonView } from './settleMgr/leakOutPersonStore';
import LeakOutXStore, { View as LeakOutXView } from './settleMgr/leakOutXStore';
import MemberImpDetailStore, { View as MemberImpDetailView } from './settleMgr/memberImpDetailStore';
import SettleCountStore, { View as SettleCountView } from './settleMgr/settleCountStore';
import SettleDetailStore, { View as SettleDetailView } from './settleMgr/settleDetailStore';
import XCountStore, { View as XCountView } from './settleMgr/xCountStore';
import MonthlyWageLeakStore, { View as MonthlyWageLeakStoreView } from './monthlyWageManager/monthlyWageLeakStore';
import PayrollImportStore, { View as payrollImportView } from './monthlyWageManager/payrollImportStore';
import PayrollSelectStore, { View as PayrollSelectView } from './monthlyWageManager/payrollSelectStore';
import ProfitForXStore, { View as ProfitForXView } from './bAccountManager/profitForXStore';
import ProfitForXStoreOld, { View as ProfitForXViewOld } from './bAccountManager/profitForXStoreOld';
import FileListStore, { View as FileListView } from './fileMgr/fileListStore';
import FileAddStore, { View as FileAddView } from './fileMgr/fileAddStore';
import RtnFeeDetailStore, { View as RtnFeeDetailView } from './returnFee/rtnFeeDetailStore';
import RtnFeeRemitAuditStore, { View as RtnRemitAuditView } from './returnFee/rtnFeeRemitAuditStore';
import RtnFeeRemitImpStore, { View as RtnFeeRemitImpView } from './returnFee/rtnFeeRemitImpStore';
import RtnFeeReportStore, { View as RtnFeeReportView } from './returnFee/rtnFeeReportStore';
import RtnFeeBillStore, { View as RtnFeeBillView } from './returnFee/rtnFeeBillStore';
import RtnFeeLabourBillStore, { View as RtnFeeLabourBillView } from './returnFee/rtnFeeLabourBillStore';
import RtnFeeMemberApplyStore, { View as RtnFeeMemberApplyView } from './returnFee/rtnFeeMemberApplyStore';
import ReturnApplicationStore, { View as ReturnApplicationView } from './returnFee/returnApplicationStore';
import LaborEntMapStore, { View as LaborEntMapView } from './basicData/laborEntMapStore';
import DataBoardZXXStore, { View as DataBoardZXXView } from './dataBoard/dataBoardZXXStore';
import DataBoardClockStore, { View as DataBoardClockView } from './dataBoard/dataBoardClockStore';
import LaborDepoMapStore, { View as LaborDepoMapView } from './basicData/laborDepoMapStore';
import LaborDepoStore, { View as LaborDepoView } from './bAccountManager/laborDepoStore';
import NoWeekBillLeakOutStore, { View as NoWeekBillLeakOutView } from './weeklyWageManager/noWeekBillLeakOutStore';
import ProfitKeepStore, { View as ProfitKeepView } from './bAccountManager/profitKeepStore';
import WorkingDaysStore, { View as WorkingDaysView } from './dataBoard/workingDaysStore';
import InWorkDaysByCycleSelectStore, { View as inWorkDaysByCycleSelectView } from './dataBoard/inWorkDaysByCycleSelectStore';
import DataBoradZXXRetenStore, { View as DataBoradZXXRetenView } from './dataBoard/dataBoradZXXReten';
import InvoiceStore, { View as InvoiceView } from './basicData/invoiceStore';
import WeekReturnFeeBillDetailStore, { View as WeekReturnFeeBillDetailView } from './weekReturnFee/weekReturnFeeBillDetailStore';
import WeekReturnFeeBillStore, { View as WeekReturnFeeBillView } from './weekReturnFee/weekReturnFeeBillStore';
import WeekReturnFeeImpStore, { View as WeekReturnFeeImpView } from './weekReturnFee/weekReturnFeeImpStore';
import WeekReturnFeeListStore, { View as WeekReturnFeeListView } from './weekReturnFee/weekReturnFeeListStore';
import WeekReturnFeeReissueStore, { View as WeekReturnFeeReissueView } from './weekReturnFee/weekReturnFeeReissueStore';
import RiskFundStore, { View as RiskFundView } from './riskFund/list';
import ProfitAnalysisSummaryStore, { View as ProfitAnalysisSummaryView } from './dataBoard/profitAnalysisSummaryStore';
import ProfitAnalysisDetailStore, { View as ProfitAnalysisDetailView } from './dataBoard/profitAnalysisDetailStore';
import DepartureWageanAlysisStore, { View as DepartureWageanAlysisView } from './dataBoard/departureWageanAlysisStore';
import PushManagementStore, { View as PushManagementView } from './systemManager/pushManagement';
import RebateForecastReportStore, { View as RebateForecastReportView } from './dataBoard/rebateForecastReportStore';
import RateOfRetentionAndRegisterStore, { View as RateOfRetentionAndRegisterView } from './dataBoard/rateOfRetentionAndRegisterStore';
import ProgressOfPayStore, { View as ProgressOfPayView } from './weeklyWageManager/progressOfPayStore';
import MonthlyMessageSetStore, { View as MonthlyMessageSetView } from './basicData/monthlyMessageSetStore';
import MonthyWagePaySetStore, { View as MonthyWagePaySetView } from './dataBoard/monthyWagePaySetStore';
import ChatAnalysisImportStore, { View as ChatAnalysisImportView } from './chatAnalysis/chatAnalysisImportStore';
import ChatAnalysisListStore, { View as ChatAnalysisListView } from './chatAnalysis/chatAnalysisListStore';
import PayManagerStore, { View as PayManagerView } from './carManager/payManagerStore';
import PriceDifferenceSubsidyListStore, { View as priceDifferenceSubsidyListView } from './dataBoard/priceDifferenceSubsidyListStore';
import ApprovedBillVoidedStore, { View as ApprovedBillVoidedView } from './approvedBillVoided/deleteBill';
import GrantScheduleStore, { View as GrantScheduleView } from './monthlyWageManager/grantScheduleStore';

const store = {
  globalStore: new GlobalStore(),
  idCardStore: new IdCardStore(idCardView),
  bankCardStore: new BankCardStore(bankCardView),
  bankCardExmportStore: new BankCardExmportStore(BankCardExmportView),
  workCardStore: new WorkCardStore(workCardView),
  companyStore: new CompanyStore(companyView),
  companyEditStore: new CompanyEditStore(companyEditView),
  labarStore: new LabarStore(labarView),
  intermediaryAgentStore: new IntermediaryAgentStore(intermediaryAgentView),
  ptRoleStore: new PtRoleStore(PtRoleView),
  ptResourceStore: new PtResourceStore(PtResourceView),
  userManagerStore: new UserManagerStore(userManagerView),
  applyStore: new ApplyStore(ApplyView), // 发薪授权---发薪申请
  authorizationStore: new AuthorizationStore(AuthorizationView), // 发薪授权---授权
  reAuthorizationStore: new ReAuthorizationStore(ReAuthorizationView), // 发薪授权---重新授权
  agencyAccountStore: new AgencyAccountStore(AgencyAccountView), // B端账户管理---中介账户
  entryAndExitStore: new EntryAndExitStore(EntryAndExitView), // B端账户管理---出入金管理
  entryAndExitDetailStore: new EntryAndExitDetailStore(EntryAndExitDetailView), // B端账户管理---导入导出详情
  labourAccountStore: new LabourAccountStore(LabourAccountView), // B端账户管理---劳务账户
  listStore: new ListStore(listView), // 名单管理
  orderStore: new OrderStore(orderView), // 订单管理
  clockInMagStore: new ClockInMagStore(clockInMagView), // 打卡记录管理
  weeklyWageBillStore: new WeeklyWageBillStore(WeeklyWageBillView),
  weeklyWageBillDetailStore: new WeeklyWageBillDetailStore(WeeklyWageBillDetailView),
  weeklyWageImportStore: new WeeklyWageImportStore(WeeklyWageImportView),
  weeklyWagePerksStore: new WeeklyWagePerksStore(WeeklyWagePerksView),
  weeklyWageImportRecordStore: new WeeklyWageImportRecordStore(WeeklyWageImportRecordView),
  departurePredictStore: new DeparturePredictStore(DeparturePredictView),
  weeklyWageListStore: new WeeklyWageListStore(WeeklyWageListView),
  weeklyWageReissueStore: new WeeklyWageReissueStore(WeeklyWageReissueView),
  monthlyWageBillStore: new MonthlyWageBillStore(MonthlyWageBillView),
  monthlyWageBillDetailStore: new MonthlyWageBillDetailStore(MonthlyWageBillDetailView),
  monthlyWageImportStore: new MonthlyWageImportStore(MonthlyWageImportView),
  monthlyWageImportRecordStore: new MonthlyWageImportRecordStore(MonthlyWageImportRecordView),
  monthlyWageListStore: new MonthlyWageListStore(MonthlyWageListView),
  monthlyWageReissueStore: new MonthlyWageReissueStore(MonthlyWageReissueView),
  withdrawManagerPayStore: new WithdrawManagerPayStore(WithdrawManagerPayView),
  withdrawManagerBackStore: new WithdrawManagerBackStore(WithdrawManagerBackView),
  bankPayAccountStore: new BankPayAcctStore(BankPayAcctView),
  agentPayAccountStore: new AgentPayAccounttStore(AgentPayAccountView),
  memberPayAccountStore: new MemberPayAccountStore(MemberPayAccountView),
  platformProfitStore: new PlatformProfitStore(PlatformProfitView),
  clockStatisticStore: new ClockStatisticStore(ClockStatisticView),
  dunningListStore: new DunningListStore(DunningListView),
  weeklyWageLeakStore: new WeeklyWageLeakStore(WeeklyWageLeakStoreView),
  monthlyWageLeakStore: new MonthlyWageLeakStore(MonthlyWageLeakStoreView),
  missInfoListStore: new MissInfoListStore(MissInfoListView),
  profitStore: new ProfitStore(ProfitView),
  profitStoreOld: new ProfitStoreOld(ProfitViewOld),
  configAgentAStore: new ConfigAgentAStore(ConfigAgentAView),
  configXStore: new ConfigXStore(ConfigXView),
  importXListStore: new ImportXListStore(ImportXListView),
  importXStore: new ImportXStore(ImportXView),
  leakOutPersonStore: new LeakOutPersonStore(LeakOutPersonView),
  leakOutXStore: new LeakOutXStore(LeakOutXView),
  memberImpDetailStore: new MemberImpDetailStore(MemberImpDetailView),
  settleCountStore: new SettleCountStore(SettleCountView),
  settleDetailStore: new SettleDetailStore(SettleDetailView),
  xCountStore: new XCountStore(XCountView),
  payrollImportStore: new PayrollImportStore(payrollImportView),
  payrollSelectStore: new PayrollSelectStore(PayrollSelectView),
  profitForXStore: new ProfitForXStore(ProfitForXView),
  profitForXStoreOld: new ProfitForXStoreOld(ProfitForXViewOld),
  fileListStore: new FileListStore(FileListView),
  fileAddStore: new FileAddStore(FileAddView),
  rtnFeeDetailStore: new RtnFeeDetailStore(RtnFeeDetailView),
  rtnFeeRemitAuditStore: new RtnFeeRemitAuditStore(RtnRemitAuditView),
  rtnFeeRemitImpStore: new RtnFeeRemitImpStore(RtnFeeRemitImpView),
  rtnFeeReportStore: new RtnFeeReportStore(RtnFeeReportView),
  rtnFeeBillStore: new RtnFeeBillStore(RtnFeeBillView),
  rtnFeeMemberApplyStore: new RtnFeeMemberApplyStore(RtnFeeMemberApplyView),
  returnApplicationStore: new ReturnApplicationStore(ReturnApplicationView),
  laborEntMapStore: new LaborEntMapStore(LaborEntMapView),
  dataBoardZXXStore: new DataBoardZXXStore(DataBoardZXXView),
  dataBoardClockStore: new DataBoardClockStore(DataBoardClockView),
  laborDepoMapStore: new LaborDepoMapStore(LaborDepoMapView),
  laborDepoStore: new LaborDepoStore(LaborDepoView),
  noWeekBillLeakOutStore: new NoWeekBillLeakOutStore(NoWeekBillLeakOutView),
  profitKeepStore: new ProfitKeepStore(ProfitKeepView),
  workingDaysStore: new WorkingDaysStore(WorkingDaysView),
  inWorkDaysByCycleSelectStore: new InWorkDaysByCycleSelectStore(inWorkDaysByCycleSelectView),
  dataBoradZXXRetenStore: new DataBoradZXXRetenStore(DataBoradZXXRetenView),
  invoiceStore: new InvoiceStore(InvoiceView),
  weekReturnFeeBillDetailStore: new WeekReturnFeeBillDetailStore(WeekReturnFeeBillDetailView),
  weekReturnFeeBillStore: new WeekReturnFeeBillStore(WeekReturnFeeBillView),
  weekReturnFeeImpStore: new WeekReturnFeeImpStore(WeekReturnFeeImpView),
  weekReturnFeeListStore: new WeekReturnFeeListStore(WeekReturnFeeListView),
  weekReturnFeeReissueStore: new WeekReturnFeeReissueStore(WeekReturnFeeReissueView),
  riskFundStore: new RiskFundStore(RiskFundView),
  pushManagementStore: new PushManagementStore(PushManagementView),
  rtnFeeLabourBillStore: new RtnFeeLabourBillStore(RtnFeeLabourBillView),
  rebateForecastReportStore: new RebateForecastReportStore(RebateForecastReportView),
  profitAnalysisSummaryStore: new ProfitAnalysisSummaryStore(ProfitAnalysisSummaryView),
  profitAnalysisDetailStore: new ProfitAnalysisDetailStore(ProfitAnalysisDetailView),
  departureWageanAlysisStore: new DepartureWageanAlysisStore(DepartureWageanAlysisView),
  progressOfPayStore: new ProgressOfPayStore(ProgressOfPayView),
  monthlyMessageSetStore: new MonthlyMessageSetStore(MonthlyMessageSetView),
  monthyWagePaySetStore: new MonthyWagePaySetStore(MonthyWagePaySetView),
  chatAnalysisImportStore: new ChatAnalysisImportStore(ChatAnalysisImportView),
  chatAnalysisListStore: new ChatAnalysisListStore(ChatAnalysisListView),
  payManagerStore: new PayManagerStore(PayManagerView),
  rateOfRetentionAndRegisterStore: new RateOfRetentionAndRegisterStore(RateOfRetentionAndRegisterView),
  priceDifferenceSubsidyListStore: new PriceDifferenceSubsidyListStore(priceDifferenceSubsidyListView),
  grantScheduleStore: new GrantScheduleStore(GrantScheduleView),
  approvedBillVoidedStore: new ApprovedBillVoidedStore(ApprovedBillVoidedView)
};

const authStore = new AuthStore(history);
const homeStore = new HomeStore(history, store);
export { authStore, homeStore };
store.authStore = authStore;

export default store;
