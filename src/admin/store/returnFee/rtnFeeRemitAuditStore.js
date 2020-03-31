import { observable, action } from "mobx";
import { message } from 'antd';
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { listAudit, expAudit } from 'ADMIN_SERVICE/ZXX_ReturnFee';

export class View extends BaseView {
    @observable searchValue = {
        AuditDtEnd: undefined,
        AuditDtStart: undefined,
        AuditSts: -9999,
        EntId: undefined,
        IdCardNum: '',
        ImportDtEnd: undefined,
        ImportDtStart: undefined,
        RealName: '',
        TrgtSpId: undefined,
        SettlementTyp: -9999
    }

    @observable pagination = {
        current: 1,
        pageSize: 10
    }

    @observable tableInfo = {
        dataList: [],
        loading: false,
        selectedRowKeys: [],
        total: 0
    };
}

export default class extends BaseViewStore {
    @action
    startQuery = async () => {
        const view = this.view;
        const {
            searchValue: { AuditDtEnd, AuditDtStart, AuditSts, EntId, IdCardNum, ImportDtEnd, ImportDtStart, RealName, TrgtSpId, SettlementTyp },
            pagination: {
                current, pageSize
            }
        } = view;

        view.tableInfo.loading = true;

        let reqParam = {
            AuditDtEnd: AuditDtEnd ? AuditDtEnd.format('YYYY-MM-DD') : '',
            AuditDtStart: AuditDtStart ? AuditDtStart.format('YYYY-MM-DD') : '',
            AuditSts,
            EntId: EntId || -9999,
            IdCardNum,
            ImportDtEnd: ImportDtEnd ? ImportDtEnd.format('YYYY-MM-DD') : '',
            ImportDtStart: ImportDtStart ? ImportDtStart.format('YYYY-MM-DD') : '',
            RealName,
            TrgtSpId: TrgtSpId || -9999,
            SettlementTyp,
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };

        try {
            let resData = await listAudit(reqParam);
            view.tableInfo = {
                dataList: resData.Data.RecordList || [],
                loading: false,
                total: resData.Data.RecordCount
            };
        } catch (err) {
            view.tableInfo.loading = false;
            message.error(err.message);
            console.log(err);
        }
    }

    @action
    exportRecord = async () => {
        const view = this.view;
        const {
            searchValue: { AuditDtEnd, AuditDtStart, AuditSts, EntId, IdCardNum, ImportDtEnd, ImportDtStart, RealName, TrgtSpId, SettlementTyp }
        } = view;


        let reqParam = {
            AuditDtEnd: AuditDtEnd ? AuditDtEnd.format('YYYY-MM-DD') : '',
            AuditDtStart: AuditDtStart ? AuditDtStart.format('YYYY-MM-DD') : '',
            AuditSts,
            EntId: EntId || -9999,
            IdCardNum,
            ImportDtEnd: ImportDtEnd ? ImportDtEnd.format('YYYY-MM-DD') : '',
            ImportDtStart: ImportDtStart ? ImportDtStart.format('YYYY-MM-DD') : '',
            RealName,
            TrgtSpId: TrgtSpId || -9999,
            SettlementTyp
        };

        try {
            let resData = await expAudit(reqParam);
            const { Data: { FileUrl } } = resData;
            window.open(FileUrl);
        } catch (err) {
            message.error(err.message);
            console.log(err);
        }
    }

    @action
    handleFormValuesChange = (values) => {
        this.view.searchValue = { ...values };
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
    setSelectRowKeys = (selectedRowKeys) => {
        this.view.tableInfo = {
            ...this.view.tableInfo,
            ...{
                selectedRowKeys: selectedRowKeys
            }
        };
    }

    @action
    resetForm = () => {
        this.view.resetProperty('searchValue');
    }
}