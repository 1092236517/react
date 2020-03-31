import { observable, action } from "mobx";
import { message, Modal } from 'antd';
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { getWeeklyWageBillList, exportWeeklyWageBillList, CancelBatch, agreeWeekBill, disAgreeWeekBill } from 'ADMIN_SERVICE/ZXX_WeekBill';


export class View extends BaseView {
    @observable searchValue = {
        BeginDt: undefined,
        EndDt: undefined,
        EntId: undefined,
        TrgtSpId: undefined,
        SrceSpId: undefined,
        BillWeeklyBatchId: '',
        BillAudit: -9999,
        BillSrce: -9999,
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
        TotAdvancePayAmt: 0,
        TotAgentAmt: 0,
        TotPayCount: 0,
        TotPlatformAmt: 0,
        TotUserCount: 0
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
        const {
            searchValue: {
                BeginDt, EndDt, EntId, TrgtSpId, SrceSpId, BillWeeklyBatchId, Operator
            },
            pagination: {
                current, pageSize
            }
        } = view;
        view.tableInfo.loading = true;

        let reqParam = {
            ...view.searchValue,
            BeginDt: BeginDt ? BeginDt.format('YYYY-MM-DD') : '',
            EndDt: EndDt ? EndDt.format('YYYY-MM-DD') : '',
            EntId: EntId || -9999,
            SrceSpId: SrceSpId || -9999,
            TrgtSpId: TrgtSpId || -9999,
            BillWeeklyBatchId: BillWeeklyBatchId ? BillWeeklyBatchId * 1 : -9999,
            Operator,
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };

        try {
            let resData = await getWeeklyWageBillList(reqParam);

            view.tableInfo = {
                dataList: resData.Data.RecordList || [],
                loading: false,
                total: resData.Data.RecordCount,
                selectedRowKeys: [],
                TotAdvancePayAmt: resData.Data.TotAdvancePayAmt,
                TotAgentAmt: resData.Data.TotAgentAmt,
                TotPayCount: resData.Data.TotPayCount,
                TotPlatformAmt: resData.Data.TotPlatformAmt,
                TotUserCount: resData.Data.TotUserCount
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
            BeginDt, EndDt, EntId, TrgtSpId, SrceSpId, BillWeeklyBatchId, Operator
        } = view.searchValue;

        let reqParam = {
            ...view.searchValue,
            BeginDt: BeginDt ? BeginDt.format('YYYY-MM-DD') : '',
            EndDt: EndDt ? EndDt.format('YYYY-MM-DD') : '',
            EntId: EntId || -9999,
            SrceSpId: SrceSpId || -9999,
            TrgtSpId: TrgtSpId || -9999,
            BillWeeklyBatchId: BillWeeklyBatchId ? BillWeeklyBatchId * 1 : -9999,
            Operator
        };

        try {
            let resData = await exportWeeklyWageBillList(reqParam);
            window.open(resData.Data.FileUrl);
        } catch (err) {
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
        //  1: 同意，2：不同意
        const view = this.view;
        const callFunc = auditSts == 1 ? agreeWeekBill : disAgreeWeekBill;
        const batchList = batchIDs.split(',').map(Number);
        let batchIndex = 0;
        const doAuditBill = () => {
            const batchID = batchList[batchIndex];
            if (!batchID) {
                view.isShowAuditModal = false;
                this.startQuery();
                return;
            }
            let reqParam = { BillWeeklyBatchId: batchID };
            callFunc(reqParam).then(() => {
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