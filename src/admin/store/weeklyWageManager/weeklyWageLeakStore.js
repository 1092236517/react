import { observable, action } from "mobx";
import { message } from 'antd';
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { getWeeklyWageLeakList, exportWeeklyWageLeakList } from 'ADMIN_SERVICE/ZXX_WeekLeak';
import moment from 'moment';

export class View extends BaseView {
    @observable searchValue = {
        BeginDt: moment().subtract(moment().day() + 7 + (moment().day() < 1 ? 7 : 0), 'days'),
        EndDt: moment().subtract(moment().day() - 6 + 7 + (moment().day() < 1 ? 7 : 0), 'days'),
        EntId: undefined,
        TrgtSpId: undefined,
        SrceSpId: undefined,
        IdCardNum: '',
        Name: '',
        OperationSts: undefined
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

    @observable TotalAmtCount = 0;
    @observable TotalClockCount = 0;
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
                BeginDt, EndDt, EntId, TrgtSpId, OperationSts, SrceSpId, IdCardNum, Name
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
            Name,
            SrceSpId: SrceSpId || -9999,
            TrgtSpId: TrgtSpId || -9999,
            OperationSts: OperationSts || -9999,
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };

        try {
            let resData = await getWeeklyWageLeakList(reqParam);

            const { Data: { RecordList, RecordCount, TotalAmtCount, TotalClockCount } } = resData;

            view.tableInfo = {
                dataList: RecordList || [],
                loading: false,
                total: RecordCount,
                selectedRowKeys: []
            };
            view.TotalAmtCount = TotalAmtCount;
            view.TotalClockCount = TotalClockCount;
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
            BeginDt, EndDt, EntId, TrgtSpId, OperationSts, SrceSpId, IdCardNum, Name
        } = view.searchValue;

        let reqParam = {
            BeginDt: BeginDt ? BeginDt.format('YYYY-MM-DD') : '',
            EndDt: EndDt ? EndDt.format('YYYY-MM-DD') : '',
            EntId: EntId || -9999,
            IdCardNum,
            Name,
            SrceSpId: SrceSpId || -9999,
            TrgtSpId: TrgtSpId || -9999,
            OperationSts: OperationSts || -9999
        };

        try {
            let resData = await exportWeeklyWageLeakList(reqParam);
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