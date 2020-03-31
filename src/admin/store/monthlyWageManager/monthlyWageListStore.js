import { observable, action } from "mobx";
import { message } from 'antd';
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { getMonthlyWageList, exportMonthlyWageList, exportMonthlyWageSPAmount, getMonthlyWageExportRes } from 'ADMIN_SERVICE/ZXX_MonthBill';
import moment from 'moment';

export class View extends BaseView {
    @observable searchValue = {
        AuditBeginDt: undefined,
        AuditEndDt: undefined,
        BillRelatedMoStart: undefined,
        BillRelatedMoEnd: undefined,
        EntId: undefined,
        TrgtSpId: undefined,
        SrceSpId: undefined,
        IdCardNum: '',
        RealName: '',
        BillMonthlyBatchId: '',
        WorkSts: -9999,
        BillSrce: -9999,
        SalaryTyp: -9999,
        TrgtSpAuditSts: -9999,
        SettlementTyp: -9999,
        EmploymentTyp: -9999,
        MonthSalaryPayer: -9999,
        JffSpEntName: ''
    }

    @observable pagination = {
        current: 1,
        pageSize: 10
    }

    @observable tableInfo = {
        dataList: [],
        loading: false,
        total: 0
    };

    @observable lableInfo = {
        MonthlyCount: 0,
        TolAgentAmt: 0,
        TolPlatformSrvcAmt: 0,
        TolRemainingSalary: 0
    }

    @observable schedulerID1 = '';
    @observable schedulerID2 = '';
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
            const { BillRelatedMoStart, BillRelatedMoEnd } = extraParams;
            view.searchValue = {
                ...view.searchValue,
                ...extraParams,
                BillRelatedMoStart: BillRelatedMoStart ? moment(BillRelatedMoStart) : moment(),
                BillRelatedMoEnd: BillRelatedMoEnd ? moment(BillRelatedMoEnd) : moment()
            };
        }

        const {
            searchValue: {
                BillRelatedMoStart, BillRelatedMoEnd, EntId, TrgtSpId, SrceSpId, BillMonthlyBatchId, AuditBeginDt, AuditEndDt
            },
            pagination: {
                current, pageSize
            }
        } = view;
        view.tableInfo.loading = true;

        let reqParam = {
            ...view.searchValue,
            AuditBeginDt: AuditBeginDt ? AuditBeginDt.format('YYYY-MM-DD') : '',
            AuditEndDt: AuditEndDt ? AuditEndDt.format('YYYY-MM-DD') : '',
            BillRelatedMoEnd: BillRelatedMoEnd ? (BillRelatedMoEnd.format('YYYY-MM') + '-01') : '',
            BillRelatedMoStart: BillRelatedMoStart ? (BillRelatedMoStart.format('YYYY-MM') + '-01') : '',
            EntId: EntId || -9999,
            SrceSpId: SrceSpId || -9999,
            TrgtSpId: TrgtSpId || -9999,
            BillMonthlyBatchId: BillMonthlyBatchId ? BillMonthlyBatchId * 1 : -9999,
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };

        try {
            let resData = await getMonthlyWageList(reqParam);

            const { Data: { RecordList, RecordCount, TolRemainingSalary, TolAgentAmt, TolPlatformSrvcAmt, MonthlyCount } } = resData;
            view.tableInfo = {
                dataList: RecordList || [],
                loading: false,
                total: RecordCount
            };

            view.lableInfo = {
                TolRemainingSalary,
                TolAgentAmt,
                TolPlatformSrvcAmt,
                MonthlyCount
            };
        } catch (err) {
            view.tableInfo.loading = false;
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
            BillRelatedMoStart, BillRelatedMoEnd, EntId, TrgtSpId, SrceSpId, BillMonthlyBatchId, AuditBeginDt, AuditEndDt
        } = view.searchValue;

        let reqParam = {
            ...view.searchValue,
            AuditBeginDt: AuditBeginDt ? AuditBeginDt.format('YYYY-MM-DD') : '',
            AuditEndDt: AuditEndDt ? AuditEndDt.format('YYYY-MM-DD') : '',
            BillRelatedMoEnd: BillRelatedMoEnd ? (BillRelatedMoEnd.format('YYYY-MM') + '-01') : '',
            BillRelatedMoStart: BillRelatedMoStart ? (BillRelatedMoStart.format('YYYY-MM') + '-01') : '',
            EntId: EntId || -9999,
            SrceSpId: SrceSpId || -9999,
            TrgtSpId: TrgtSpId || -9999,
            BillMonthlyBatchId: BillMonthlyBatchId ? BillMonthlyBatchId * 1 : -9999
        };

        try {
            let resData = await exportMonthlyWageList(reqParam);
            const { Data: { BizID } } = resData;
            this.getMonthlyWageExportRes(BizID, 1);
            view.schedulerID1 = setInterval(() => {
                this.getMonthlyWageExportRes(BizID, 1);
            }, 2000);
        } catch (err) {
            message.error(err.message);
            console.log(err);
        }
    }

    @action
    exportSPAmout = async () => {
        const view = this.view;
        const {
            BillRelatedMoStart, BillRelatedMoEnd, EntId, TrgtSpId, SrceSpId, BillMonthlyBatchId, AuditBeginDt, AuditEndDt, TrgtSpAuditSts
        } = view.searchValue;

        if (TrgtSpAuditSts != 2) {
            message.info('请筛选审核通过的数据导出');
            return;
        }

        let reqParam = {
            ...view.searchValue,
            AuditBeginDt: AuditBeginDt ? AuditBeginDt.format('YYYY-MM-DD') : '',
            AuditEndDt: AuditEndDt ? AuditEndDt.format('YYYY-MM-DD') : '',
            BillRelatedMoEnd: BillRelatedMoEnd ? (BillRelatedMoEnd.format('YYYY-MM') + '-01') : '',
            BillRelatedMoStart: BillRelatedMoStart ? (BillRelatedMoStart.format('YYYY-MM') + '-01') : '',
            EntId: EntId || -9999,
            SrceSpId: SrceSpId || -9999,
            TrgtSpId: TrgtSpId || -9999,
            BillMonthlyBatchId: BillMonthlyBatchId ? BillMonthlyBatchId * 1 : -9999
        };

        try {
            let resData = await exportMonthlyWageSPAmount(reqParam);
            const { Data: { BizID } } = resData;
            this.getMonthlyWageExportRes(BizID, 2);
            view.schedulerID2 = setInterval(() => {
                this.getMonthlyWageExportRes(BizID, 2);
            }, 2000);
        } catch (err) {
            message.error(err.message);
            console.log(err);
        }
    }

    @action
    getMonthlyWageExportRes = async (BizID, which) => {
        const view = this.view;
        let reqParam = { BizID };
        try {
            let resData = await getMonthlyWageExportRes(reqParam);
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