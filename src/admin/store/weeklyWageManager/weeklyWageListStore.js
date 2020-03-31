import { observable, action } from "mobx";
import { message } from 'antd';
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { getWeeklyWageListData, getWeeklyWageListBizId, exportWeeklyWageList, exportWeeklyWageSPAmout, getWeeklyWageExportRes } from 'ADMIN_SERVICE/ZXX_WeekBill';
import moment from 'moment';

export class View extends BaseView {
    @observable searchValue = {
        BeginDt: undefined,
        EndDt: undefined,
        AuditBeginDt: undefined,
        AuditEndDt: undefined,
        EntId: undefined,
        TrgtSpId: undefined,
        SrceSpId: undefined,
        IdCardNum: '',
        RealName: '',
        AuditSts: -9999,
        WorkSts: -9999,
        IsAgentAmtForBroker: -9999,
        BillSrce: -9999,
        LaborConfirmedAmt: -9999,
        BillWeeklyBatchId: '',
        SrceFlag: -9999,
        SettlementTyp: -9999,
        EmploymentTyp: -9999,
        JffSpEntName: ''
    }

    @observable pagination = {
        current: 1,
        pageSize: 10
    }

    @observable tableInfo = {
        dataList: [],
        loading: false,
        total: 0,
        searchLoading: false
    };

    @observable lableInfo = {
        TolAdvancePayAmt: 0,
        TolAgentAmt: 0,
        TolPlatformSrvcAmt: 0,
        WeeklyCount: 0
    }

    @observable schedulerID1 = '';
    @observable schedulerID2 = '';
    @observable schedulerList = '';
}

export default class extends BaseViewStore {
    @action
    handleFormValuesChange = (values) => {
        this.view.searchValue = values;
    }

    @action
    startQuery = async (extraParams) => {
        const view = this.view;
        if (extraParams) {
            const { AuditBeginDt, AuditEndDt } = extraParams;
            view.searchValue = {
                ...view.searchValue,
                ...extraParams,
                AuditBeginDt: AuditBeginDt ? moment(AuditBeginDt) : moment(),
                AuditEndDt: AuditEndDt ? moment(AuditEndDt) : moment()
            };
        }

        const {
            searchValue: {
                BeginDt, EndDt, EntId, TrgtSpId, SrceSpId, LaborConfirmedAmt, BillWeeklyBatchId, AuditSts, AuditBeginDt, AuditEndDt
            },
            pagination: {
                current, pageSize
            }
        } = view;
        view.tableInfo.loading = true;
        view.tableInfo.searchLoading = true;
        let reqParam = {
            ...view.searchValue,
            AuditBeginDt: AuditBeginDt ? AuditBeginDt.format('YYYY-MM-DD') : '',
            AuditEndDt: AuditEndDt ? AuditEndDt.format('YYYY-MM-DD') : '',
            BeginDt: BeginDt ? BeginDt.format('YYYY-MM-DD') : '',
            EndDt: EndDt ? EndDt.format('YYYY-MM-DD') : '',
            EntId: EntId || -9999,
            LaborConfirmedAmt: LaborConfirmedAmt,
            SrceSpId: SrceSpId || -9999,
            TrgtSpId: TrgtSpId || -9999,
            BillWeeklyBatchId: BillWeeklyBatchId ? BillWeeklyBatchId * 1 : -9999,
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };

        try {

            let resData = await getWeeklyWageListBizId(reqParam);
            const { Data: { BizID } } = resData;
            this.getWeeklyWageTableData(BizID);
            view.schedulerList = setInterval(() => {
                this.getWeeklyWageTableData(BizID);
            }, 2000);

        } catch (err) {
            view.tableInfo.loading = false;
            view.tableInfo.searchLoading = false;
            message.error(err.message);
            console.log(err);
        }
    }

    @action
    getWeeklyWageTableData = async (BizID) => {
        const view = this.view;
        let reqParam = { BizID };
        try {
            let resData = await getWeeklyWageListData(reqParam);
            const { State, TaskCode, TaskDesc, RecordList, RecordCount, TolAdvancePayAmt, TolAgentAmt, TolPlatformSrvcAmt, WeeklyCount } = resData.Data;
            if (State == 0) {
                //    未完成
                message.loading('正在查询记录请稍候！');
            } else {
                //  已完成
                window.clearInterval(view[`schedulerList`]);
                view[`schedulerList`] = '';
                if (TaskCode == 0) {
                    view.tableInfo = {
                        dataList: RecordList || [],
                        loading: false,
                        searchLoading: false,
                        total: RecordCount
                    };
                    view.lableInfo = {
                        TolAdvancePayAmt,
                        TolAgentAmt,
                        TolPlatformSrvcAmt,
                        WeeklyCount
                    };
                } else {
                    message.error(TaskDesc);
                }
            }
        } catch (err) {
            window.clearInterval(view[`schedulerList`]);
            view[`schedulerList`] = '';
            message.error(err.message);
            console.log(err);
        }
    }



    @action
    setPagination = (current, pageSize) => {
        let view = this.view;
        view.pagination = {
            current,
            pageSize
        };
        this.startQuery();
    }

    @action
    resetPageCurrent = () => {
        let view = this.view;
        view.pagination = {
            ...view.pagination,
            current: 1
        };
    }

    @action
    exportRecord = async () => {
        const view = this.view;
        const {
            BeginDt, EndDt, EntId, TrgtSpId, SrceSpId, WorkSts, IsAgentAmtForBroker, BillWeeklyBatchId, AuditBeginDt, AuditEndDt
        } = view.searchValue;

        let reqParam = {
            ...view.searchValue,
            AuditBeginDt: AuditBeginDt ? AuditBeginDt.format('YYYY-MM-DD') : '',
            AuditEndDt: AuditEndDt ? AuditEndDt.format('YYYY-MM-DD') : '',
            BeginDt: BeginDt ? BeginDt.format('YYYY-MM-DD') : '',
            EndDt: EndDt ? EndDt.format('YYYY-MM-DD') : '',
            EntId: EntId || -9999,
            SrceSpId: SrceSpId || -9999,
            TrgtSpId: TrgtSpId || -9999,
            WorkSts,
            IsAgentAmtForBroker,
            BillWeeklyBatchId: BillWeeklyBatchId ? BillWeeklyBatchId * 1 : -9999
        };

        try {
            let resData = await exportWeeklyWageList(reqParam);
            const { Data: { BizID } } = resData;
            this.getWeeklyWageExportRes(BizID, 1);
            view.schedulerID1 = setInterval(() => {
                this.getWeeklyWageExportRes(BizID, 1);
            }, 2000);
        } catch (err) {
            message.error(err.message);
            console.log(err);
        }
    }

    @action
    exportSPAmount = async () => {
        const view = this.view;
        const {
            BeginDt, EndDt, EntId, TrgtSpId, SrceSpId, BillWeeklyBatchId, AuditSts, IsAgentAmtForBroker, AuditBeginDt, AuditEndDt
        } = view.searchValue;

        if (AuditSts != 2) {
            message.info('请筛选审核通过的数据导出');
            return;
        }

        let reqParam = {
            ...view.searchValue,
            AuditBeginDt: AuditBeginDt ? AuditBeginDt.format('YYYY-MM-DD') : '',
            AuditEndDt: AuditEndDt ? AuditEndDt.format('YYYY-MM-DD') : '',
            BeginDt: BeginDt ? BeginDt.format('YYYY-MM-DD') : '',
            EndDt: EndDt ? EndDt.format('YYYY-MM-DD') : '',
            EntId: EntId || -9999,
            SrceSpId: SrceSpId || -9999,
            TrgtSpId: TrgtSpId || -9999,
            IsAgentAmtForBroker: IsAgentAmtForBroker || -9999,
            BillWeeklyBatchId: BillWeeklyBatchId ? BillWeeklyBatchId * 1 : -9999
        };

        try {
            let resData = await exportWeeklyWageSPAmout(reqParam);

            const { Data: { BizID } } = resData;
            this.getWeeklyWageExportRes(BizID, 2);
            view.schedulerID2 = setInterval(() => {
                this.getWeeklyWageExportRes(BizID, 2);
            }, 2000);
        } catch (err) {
            message.error(err.message);
            console.log(err);
        }
    }

    @action
    getWeeklyWageExportRes = async (BizID, which) => {
        const view = this.view;
        let reqParam = { BizID };
        try {
            let resData = await getWeeklyWageExportRes(reqParam);
            const { State, FileUrl, TaskCode, TaskDesc } = resData.Data;

            if (State == 0) {
                //    未完成
                message.loading('正在导出记录请稍候！');
            } else {
                //  已完成
                window.clearInterval(view[`schedulerID${which}`]);
                view[`schedulerID${which}`] = '';
                if (TaskCode == 0) {
                    window.open(FileUrl);
                } else {
                    message.error(TaskDesc);
                }
            }
        } catch (err) {
            window.clearInterval(view[`schedulerID${which}`]);
            view[`schedulerID${which}`] = '';
            message.error(err.message);
            console.log(err);
        }
    }

    @action
    handleFormReset = () => {
        this.view.resetProperty('searchValue');
    }
}