import { observable, action } from "mobx";
import { message } from 'antd';
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { listBill, exportBill, auditBill, saveMarkRecord } from 'ADMIN_SERVICE/ZXX_ReturnFeeBill';

export class View extends BaseView {
    @observable searchValue = {
        AuditSts: -9999,
        EntId: undefined,
        HasReturnFee: 1,
        IdCardNum: '',
        IsSendSp: -9999,
        RealName: '',
        ReturnFeeBillId: '',
        SettlementTyp: -9999,
        TransferResult: -9999,
        TrgtSpId: undefined,
        WorkCardNo: ''
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
        selectedRows: [],
        TolReturnFee: 0
    };
    @observable requestInfo = { currentRequestCount: 0, successCount: 0, failCount: 0 }
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
                EntId, TrgtSpId, ReturnFeeBillId, AuditStartTm, AuditEndTm
            },
            pagination: {
                current, pageSize
            }
        } = view;
        view.tableInfo.loading = true;

        let reqParam = {
            ...view.searchValue,
            EntId: EntId || -9999,
            TrgtSpId: TrgtSpId || -9999,
            HasReturnFee: 1,
            ReturnFeeBillId: ReturnFeeBillId ? ReturnFeeBillId * 1 : -9999,
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize,
            AuditStartTm: AuditStartTm ? AuditStartTm.format('YYYY-MM-DD HH:mm') : '',
            AuditEndTm: AuditEndTm ? AuditEndTm.format('YYYY-MM-DD HH:mm') : ''
        };

        try {
            const resData = await listBill(reqParam);
            const { RecordList, RecordCount, TolReturnFee } = resData.Data;

            view.tableInfo = {
                dataList: RecordList || [],
                loading: false,
                total: RecordCount,
                selectedRowKeys: [],
                selectedRows: [],
                TolReturnFee: TolReturnFee || 0
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
    setSelectRowKeys = (selectedRowKeys, selectedRows) => {
        this.view.tableInfo = {
            ...this.view.tableInfo,
            ...{
                selectedRowKeys,
                selectedRows
            }
        };
    }

    @action
    exportRecord = async () => {
        const view = this.view;
        const { EntId, TrgtSpId, ReturnFeeBillId } = view.searchValue;

        let reqParam = {
            ...view.searchValue,
            EntId: EntId || -9999,
            TrgtSpId: TrgtSpId || -9999,
            ReturnFeeBillId: ReturnFeeBillId ? ReturnFeeBillId * 1 : -9999,
            HasReturnFee: 1
        };

        try {
            let resData = await exportBill(reqParam);
            window.open(resData.Data.FileUrl);
        } catch (err) {
            message.error(err.message);
            console.log(err);
        }
    }

    @action
    resetForm = () => {
        this.view.resetProperty('searchValue');
    }
    @action
    auditBillOpt = async (auditSts) => {
        const view = this.view;
        let count = 0;
        let { tableInfo: { selectedRows } } = view;
        this.view.requestInfo = { currentRequestCount: 0, successCount: 0, failCount: 0 };
        await selectedRows.forEach((item, index) => {
            this.auditBill(item.ReturnFeeBillId, auditSts);
        });
    }

    @action
    auditBill = (batchID, auditSts) => {
        let reqParam = { ReturnFeeBillId: batchID, AuditSts: auditSts, InvalidReason: '' };
        let { tableInfo: { selectedRows } } = this.view;
        auditBill(reqParam).then(() => {
            this.view.requestInfo.currentRequestCount += 1;
            this.view.requestInfo.successCount += 1;
            if (selectedRows.length == this.view.requestInfo.currentRequestCount) {
                message.info(`操作结束。${this.view.requestInfo.successCount > 0 ? `成功${this.view.requestInfo.successCount}条` : ''}\t${this.view.requestInfo.failCount > 0 ? `失败${this.view.requestInfo.failCount}条` : ''}`);
                this.startQuery();
            }
        }).catch((err) => {
            this.view.requestInfo.failCount += 1;
            message.error(err.message);
            console.log(err);
        });
    }
    @action
    saveMarkRecord = async (reqParam) => {
        try {
            let resData = await saveMarkRecord(reqParam);
            return resData;
        } catch (err) {
            message.error(err.message);
            console.log(err);
        }
    }
}