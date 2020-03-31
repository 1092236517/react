import { observable, action } from "mobx";
import { message } from 'antd';
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { getMonthlyWageImportList, exportMonthlyWageImportRecord } from 'ADMIN_SERVICE/ZXX_MonthBill';

export class View extends BaseView {
    @observable searchValue = {
        BillRelatedMoStart: undefined,
        BillRelatedMoEnd: undefined,
        EntId: undefined,
        TrgtSpId: undefined,
        SrceSpId: undefined,
        IdCardNum: '',
        RealName: '',
        WorkSts: -9999,
        BillSrce: -9999,
        UpdateTmStart: undefined,
        UpdateTmEnd: undefined,
        SalaryTyp: -9999,
        Operator: ''
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
                BillRelatedMoStart, BillRelatedMoEnd, EntId, TrgtSpId, SrceSpId, IdCardNum, RealName, WorkSts, BillSrce, UpdateTmStart, UpdateTmEnd, SalaryTyp, Operator
            },
            pagination: {
                current, pageSize
            }
        } = view;
        view.tableInfo.loading = true;

        let reqParam = {
            BillRelatedMoEnd: BillRelatedMoEnd ? (BillRelatedMoEnd.format('YYYY-MM') + '-01') : '',
            BillRelatedMoStart: BillRelatedMoStart ? (BillRelatedMoStart.format('YYYY-MM') + '-01') : '',
            BillSrce,
            EntId: EntId || -9999,
            IdCardNum,
            RealName,
            SrceSpId: SrceSpId || -9999,
            TrgtSpId: TrgtSpId || -9999,
            UpdateTmEnd: UpdateTmEnd ? UpdateTmEnd.format('YYYY-MM-DD') : '',
            UpdateTmStart: UpdateTmStart ? UpdateTmStart.format('YYYY-MM-DD') : '',
            WorkSts,
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize,
            SalaryTyp,
            Operator
        };

        try {
            let resData = await getMonthlyWageImportList(reqParam);
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

    //  设置分页
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
        const { BillRelatedMoStart, BillRelatedMoEnd, EntId, TrgtSpId, SrceSpId, IdCardNum, RealName, WorkSts, BillSrce, UpdateTmStart, UpdateTmEnd, SalaryTyp, Operator } = view.searchValue;

        let reqParam = {
            BillRelatedMoEnd: BillRelatedMoEnd ? (BillRelatedMoEnd.format('YYYY-MM') + '-01') : '',
            BillRelatedMoStart: BillRelatedMoStart ? (BillRelatedMoStart.format('YYYY-MM') + '-01') : '',
            BillSrce,
            EntId: EntId || -9999,
            IdCardNum,
            RealName,
            SrceSpId: SrceSpId || -9999,
            TrgtSpId: TrgtSpId || -9999,
            UpdateTmEnd: UpdateTmEnd ? UpdateTmEnd.format('YYYY-MM-DD') : '',
            UpdateTmStart: UpdateTmStart ? UpdateTmStart.format('YYYY-MM-DD') : '',
            WorkSts,
            SalaryTyp,
            Operator
        };

        try {
            let resData = await exportMonthlyWageImportRecord(reqParam);
            window.open(resData.Data.FileUrl);
        } catch (err) {
            message.error(err.message);
            console.log(err);
        }
    }
}
