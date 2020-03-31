import { NoWeekBillLeakOut, NoWeekBillLeakOutExport } from 'ADMIN_SERVICE/ZXX_WeekLeak';
import { message } from 'antd';
import { action, observable } from "mobx";
import moment from 'moment';
import { BaseView, BaseViewStore } from "../BaseViewStore";

export class View extends BaseView {
    @observable searchValue = {
        BeginDt: moment().subtract(moment().day() + 7 + (moment().day() < 1 ? 7 : 0), 'days'),
        EndDt: moment().subtract(moment().day() - 6 + 7 + (moment().day() < 1 ? 7 : 0), 'days'),
        EntId: undefined,
        TrgtSpId: undefined,
        SrceSpId: undefined,
        IdCardNum: '',
        RealName: '',
        WorkSts: undefined
    }

    @observable pagination = {
        current: 1,
        pageSize: 10
    }

    @observable tableInfo = {
        dataList: [],
        loading: false,
        total: 0,
        selectedRowKeys: []
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
                BeginDt, EndDt, EntId, TrgtSpId, WorkSts, SrceSpId, IdCardNum, RealName
            },
            pagination: {
                current, pageSize
            }
        } = view;
        view.tableInfo.loading = true;

        let reqParam = {
            BeginDt: BeginDt ? BeginDt.format('YYYY-MM-DD') : '',
            EndDt: EndDt ? EndDt.format('YYYY-MM-DD') : '',
            EntId: EntId || -9999,
            IdCardNum,
            RealName,
            SrceSpId: SrceSpId || -9999,
            TrgtSpId: TrgtSpId || -9999,
            WorkSts: WorkSts || -9999
            // RecordIndex: (current - 1) * pageSize,
            // RecordSize: pageSize
        };

        try {
            let resData = await NoWeekBillLeakOut(reqParam);

            const { Data: { RecordList, RecordCount } } = resData;

            view.tableInfo = {
                dataList: RecordList || [],
                loading: false,
                total: RecordCount,
                selectedRowKeys: []
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
        const {
            BeginDt, EndDt, EntId, TrgtSpId, WorkSts, SrceSpId, IdCardNum, RealName
        } = view.searchValue;

        let reqParam = {
            BeginDt: BeginDt ? BeginDt.format('YYYY-MM-DD') : '',
            EndDt: EndDt ? EndDt.format('YYYY-MM-DD') : '',
            EntId: EntId || -9999,
            IdCardNum,
            RealName,
            SrceSpId: SrceSpId || -9999,
            TrgtSpId: TrgtSpId || -9999,
            WorkSts: WorkSts || -9999
        };

        try {
            let resData = await NoWeekBillLeakOutExport(reqParam);
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
}