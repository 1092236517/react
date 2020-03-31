import { CancelBatch, exportMonthlyWageBillList, getMonthlyWageBillList, auditMonthlyWageBill } from 'ADMIN_SERVICE/ZXX_MonthBill';
import { message, Modal } from 'antd';
import { action, observable } from "mobx";
import { BaseView, BaseViewStore } from "../BaseViewStore";

export class View extends BaseView {
    @observable searchValue = {
        BillRelatedMoStart: undefined,
        BillRelatedMoEnd: undefined,
        BillMonthlyBatchId: '',
        EntId: undefined,
        TrgtSpId: undefined,
        TrgtSpAuditSts: -9999,
        BillSrce: -9999,
        SalaryTyp: -9999,
        SalaryPayer: -9999,
        Operator: ''
    }
    @observable pagination = {
        current: 1,
        pageSize: 10
    }

    @observable tableInfo = {
        dataList: [],
        loading: false,
        total: 0,
        selectedRowKeys: [],
        PlatformSrvcAmt: 0,
        RecordCount: 0,
        TotMonthlySalary: 0,
        TotOkRemainingSalary: 0,
        TotOkTrgtSpMonthlyPaidSalary: 0,
        TotOkWeeklyPaidAmt: 0,
        TotPayCnt: 0,
        TotUserCnt: 0
    };

    @observable isShowAuditModal = false;
}

export default class extends BaseViewStore {
    @action
    handleFormValuesChange = (values) => {
        this.view.searchValue = values;
    }

    @action
    startQuery = async () => {
        const view = this.view;
        const { BillRelatedMoStart, BillRelatedMoEnd, BillMonthlyBatchId, EntId, TrgtSpId, Operator } = view.searchValue;
        const { current, pageSize } = view.pagination;

        let reqParam = {
            ...view.searchValue,
            BillMonthlyBatchId: BillMonthlyBatchId ? BillMonthlyBatchId * 1 : -9999,
            BillRelatedMoEnd: BillRelatedMoEnd ? (BillRelatedMoEnd.format('YYYY-MM') + '-01') : '',
            BillRelatedMoStart: BillRelatedMoStart ? (BillRelatedMoStart.format('YYYY-MM') + '-01') : '',
            EntId: EntId || -9999,
            TrgtSpId: TrgtSpId || -9999,
            Operator,
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };

        try {
            view.tableInfo.loading = true;
            let resData = await getMonthlyWageBillList(reqParam);

            view.tableInfo = {
                dataList: resData.Data.RecordList || [],
                loading: false,
                total: resData.Data.RecordCount,
                selectedRowKeys: [],
                PlatformSrvcAmt: resData.Data.PlatformSrvcAmt,
                RecordCount: resData.Data.RecordCount,
                TotMonthlySalary: resData.Data.TotMonthlySalary,
                TotOkRemainingSalary: resData.Data.TotOkRemainingSalary,
                TotOkTrgtSpMonthlyPaidSalary: resData.Data.TotOkTrgtSpMonthlyPaidSalary,
                TotOkWeeklyPaidAmt: resData.Data.TotOkWeeklyPaidAmt,
                TotPayCnt: resData.Data.TotPayCnt,
                TotUserCnt: resData.Data.TotUserCnt
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
        const { BillRelatedMoStart, BillRelatedMoEnd, BillMonthlyBatchId, EntId, TrgtSpId, Operator } = view.searchValue;
        let reqParam = {
            ...view.searchValue,
            BillMonthlyBatchId: BillMonthlyBatchId ? BillMonthlyBatchId * 1 : -9999,
            BillRelatedMoEnd: BillRelatedMoEnd ? (BillRelatedMoEnd.format('YYYY-MM') + '-01') : '',
            BillRelatedMoStart: BillRelatedMoStart ? (BillRelatedMoStart.format('YYYY-MM') + '-01') : '',
            EntId: EntId || -9999,
            TrgtSpId: TrgtSpId || -9999,
            Operator
        };

        try {
            let resData = await exportMonthlyWageBillList(reqParam);
            window.open(resData.Data.FileUrl);
        } catch (err) {
            view.tableInfo.loading = false;
            message.error(err.message);
            console.log(err);
        }
    }

    @action
    setSelectRowKeys = (selectedRowKeys) => {
        this.view.tableInfo = {
            ...this.view.tableInfo,
            ...{
                selectedRowKeys: selectedRowKeys
            }
        };
    }

    @action
    cancelBatch = async () => {
        const rows = this.view.tableInfo.selectedRowKeys || [];
        if (rows.length == 0) {
            message.info('请选择一条记录！');
            return;
        }

        Modal.confirm({
            title: '提示',
            content: '您确定要作废选择的所有记录吗？',
            onOk: async () => {
                let reqParam = { BatchIDs: this.view.tableInfo.selectedRowKeys };
                try {
                    await CancelBatch(reqParam);
                    message.success("作废成功");
                    this.startQuery();
                } catch (error) {
                    message.error(error.message);
                    console.log(error);
                }
            }
        });
    }

    @action
    showAuditModal = () => {
        const rows = this.view.tableInfo.selectedRowKeys || [];
        if (rows.length == 0) {
            message.info('请选择一条记录！');
            return;
        }
        this.view.isShowAuditModal = true;
    }

    @action
    closeAuditModal = () => {
        this.view.isShowAuditModal = false;
        this.setSelectRowKeys([]);
    }

    @action
    auditBill = (batchIDs, auditSts) => {
        if (!batchIDs) {
            message.info('请选择一条记录！');
            return;
        }

        const view = this.view;
        const batchList = batchIDs.split(',').map(Number);
        let batchIndex = 0;
        const doAuditBill = () => {
            const batchID = batchList[batchIndex];
            if (!batchID) {
                view.isShowAuditModal = false;
                this.startQuery();
                return;
            }
            let reqParam = {
                BillMonthlyBatchId: batchID,
                IsAudit: auditSts
            };

            auditMonthlyWageBill(reqParam).then(() => {
                message.success('操作成功！');
                ++batchIndex;
                doAuditBill();
            }).catch((err) => {
                message.error(err.message);
                console.log(err);
                ++batchIndex;
                doAuditBill();
            });
        };
        doAuditBill();
    }

    @action
    resetForm = () => {
        this.view.resetProperty('searchValue');
    }
}