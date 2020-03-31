import { observable, action } from "mobx";
import { message } from 'antd';
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { listMemberApply, exportMemberApply } from 'ADMIN_SERVICE/ZXX_ReturnFeeBill';

export class View extends BaseView {
    @observable searchValue = {
        ApplyStartDt: undefined,
        ApplyEndDt: undefined,
        AuditSts: -9999,
        EntId: undefined,
        HasReturnFee: -9999,
        IdCardNum: '',
        IsSendSp: -9999,
        // IsSubsidy: -9999,
        RealName: '',
        SettlementTyp: -9999,
        TransferResult: -9999,
        TrgtSpId: undefined,
        WorkCardNo: '',
        ReturnFeeIsTax: -9999,
        FfEndDtStart: undefined,
        FfEndDtEnd: undefined,
        WorkSts: -9999,
        IntvDtEnd: null,
        IntvDtStart: null,
        IsHasEntryDt: -9999
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
        TolReturnFee: 0,
        TolReturnFeeAfterTax: 0
    };
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
                ApplyStartDt, ApplyEndDt, EntId, TrgtSpId, FfEndDtStart, FfEndDtEnd, WorkSts, IsHasEntryDt, IntvDtEnd, IntvDtStart

            },
            pagination: {
                current, pageSize
            }
        } = view;

        let reqParam = {
            ...view.searchValue,
            ApplyStartDt: ApplyStartDt ? ApplyStartDt.format('YYYY-MM-DD') : '',
            ApplyEndDt: ApplyEndDt ? ApplyEndDt.format('YYYY-MM-DD') : '',
            FfEndDtStart: FfEndDtStart ? FfEndDtStart.format('YYYY-MM-DD') : '',
            FfEndDtEnd: FfEndDtEnd ? FfEndDtEnd.format('YYYY-MM-DD') : '',
            EntId: EntId || -9999,
            TrgtSpId: TrgtSpId || -9999,
            IsHasEntryDt: IsHasEntryDt || -9999,
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize,
            IntvDtEnd: IntvDtEnd ? IntvDtEnd.format('YYYY-MM-DD') : '',
            IntvDtStart: IntvDtStart ? IntvDtStart.format('YYYY-MM-DD') : '',
            WorkSts: WorkSts || -9999
        };

        try {
            view.tableInfo.loading = true;
            const resData = await listMemberApply(reqParam);
            const { Data: { RecordList, RecordCount, TolReturnFee, TolReturnFeeAfterTax } } = resData;
            view.tableInfo = {
                dataList: RecordList || [],
                loading: false,
                total: RecordCount,
                selectedRowKeys: [],
                selectedRows: [],
                TolReturnFee: TolReturnFee || 0,
                TolReturnFeeAfterTax: TolReturnFeeAfterTax || 0
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
    resetForm = () => {
        this.view.resetProperty('searchValue');
    }
    @action
    exportRecord = async () => {
        const view = this.view;
        const { EntId, TrgtSpId, IntvDtEnd, IntvDtStart } = view.searchValue;

        let reqParam = {
            ...view.searchValue,
            EntId: EntId || -9999,
            IntvDtEnd: IntvDtEnd ? IntvDtEnd.format('YYYY-MM-DD') : '',
            IntvDtStart: IntvDtStart ? IntvDtStart.format('YYYY-MM-DD') : '',
            TrgtSpId: TrgtSpId || -9999
        };

        try {
            let resData = await exportMemberApply(reqParam);
            window.open(resData.Data.FileUrl);
        } catch (err) {
            message.error(err.message);
            console.log(err);
        }
    }
}