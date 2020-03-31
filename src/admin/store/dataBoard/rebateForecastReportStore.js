import { observable, action } from "mobx";
import { message } from 'antd';
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { getRebateForecastReport, exportRebateForecastReport, getRebateForecastReportList } from 'ADMIN_SERVICE/ZXX_BaseData';
export class View extends BaseView {
    @observable searchValue = {
        HasReturnFee: null,
        IntvDtStart: null,
        IntvDtEnd: null,
        RealName: '',
        IdCardNum: '',
        FfEndDtStart: null,
        FfEndDtEnd: null,
        WorkSts: null,
        TrgtSpId: '',
        EntId: '',
        ApplySts: '',
        TransferResult: '',
        AuditSts: ''

    }

    @observable pagination = {
        current: 1,
        pageSize: 10
    }

    @observable tableInfo = {
        dataList: [],
        loading: false,
        total: 0,
        TolOrderRf: 0,
        TolPredictRf: 0,
        TolPaidRf: 0,
        TolNotPayRf: 0
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
                FfEndDtStart, FfEndDtEnd, IntvDtEnd, IntvDtStart, HasReturnFee, WorkSts, EntId, TrgtSpId, ApplySts, TransferResult, AuditSts
            },
            pagination: {
                current, pageSize
            }
        } = view;
        view.tableInfo.loading = true;
        let reqParam = {
            ...view.searchValue,
            FfEndDtStart: FfEndDtStart ? FfEndDtStart.format('YYYY-MM-DD') : '',
            FfEndDtEnd: FfEndDtEnd ? FfEndDtEnd.format('YYYY-MM-DD') : '',
            IntvDtEnd: IntvDtEnd ? IntvDtEnd.format('YYYY-MM-DD') : '',
            IntvDtStart: IntvDtStart ? IntvDtStart.format('YYYY-MM-DD') : '',
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize,
            HasReturnFee: HasReturnFee ? HasReturnFee : -9999,
            WorkSts: WorkSts ? WorkSts : -9999,
            EntId: EntId || -9999,
            TrgtSpId: TrgtSpId || -9999,
            ApplySts: ApplySts || -9999,
            TransferResult: TransferResult || -9999,
            AuditSts: AuditSts || -9999

        };
        try {
            let resData = await getRebateForecastReport(reqParam);
            view.tableInfo = {
                dataList: resData.Data.RecordList || [],
                loading: false,
                total: resData.Data.RecordCount,
                TolOrderRf: resData.Data.TolOrderRf,
                TolPredictRf: resData.Data.TolPredictRf,
                TolPaidRf: resData.Data.TolPaidRf,
                TolNotPayRf: resData.Data.TolNotPayRf
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
    resetForm = () => {
        this.view.resetProperty('searchValue');
    }

    @action
    exportRecord = async () => {
        const view = this.view;
        const {
            searchValue: {
                FfEndDtStart, FfEndDtEnd, IntvDtEnd, IntvDtStart, HasReturnFee, WorkSts, EntId, TrgtSpId, ApplySts, TransferResult, AuditSts
            },
            pagination: {
                current, pageSize
            }
        } = view;
        let reqParam = {
            ...view.searchValue,
            FfEndDtStart: FfEndDtStart ? FfEndDtStart.format('YYYY-MM-DD') : '',
            FfEndDtEnd: FfEndDtEnd ? FfEndDtEnd.format('YYYY-MM-DD') : '',
            IntvDtEnd: IntvDtEnd ? IntvDtEnd.format('YYYY-MM-DD') : '',
            IntvDtStart: IntvDtStart ? IntvDtStart.format('YYYY-MM-DD') : '',
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize,
            HasReturnFee: HasReturnFee ? HasReturnFee : -9999,
            WorkSts: WorkSts ? WorkSts : -9999,
            EntId: EntId || -9999,
            TrgtSpId: TrgtSpId || -9999,
            ApplySts: ApplySts || -9999,
            TransferResult: TransferResult || -9999,
            AuditSts: AuditSts || -9999

        };

        try {
            let resData = await exportRebateForecastReport(reqParam);
            const { Data: { BizID } } = resData;
            this.getExportRes(BizID);
            this.schedulerID = setInterval(() => {
                this.getExportRes(BizID);
            }, 2000);
        } catch (err) {
            message.error(err.message);
            console.log(err);
        }
    }

    getExportRes = async (BizID) => {
        let reqParam = { BizID };
        try {
            let resData = await getRebateForecastReportList(reqParam);
            const { State, FileUrl, TaskCode, TaskDesc } = resData.Data;

            if (State == 0) {
                //    未完成
                message.loading('正在导出记录请稍候！');
            } else {
                //  已完成
                window.clearInterval(this.schedulerID);
                this.schedulerID = '';
                if (TaskCode == 0) {
                    window.open(FileUrl);
                } else {
                    message.error(TaskDesc);
                }
            }
        } catch (err) {
            window.clearInterval(this.schedulerID);
            this.schedulerID = '';
            message.error(err.message);
            console.log(err);
        }
    }
}