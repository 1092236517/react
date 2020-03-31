import { InWorkDaysSelect } from 'ADMIN_SERVICE/ZXX_KanBan';
import { message } from 'antd';
import { action, observable } from "mobx";
import { BaseView, BaseViewStore } from "../BaseViewStore";

export class View extends BaseView {
    @observable searchValue = {
        EntryDtStart: undefined,
        EntryDtEnd: undefined,
        EntId: undefined,
        TrgtSpId: undefined,
        IntvDtStart: undefined,
        IntvDtEnd: undefined,
        LeaveDtStart: undefined,
        LeaveDtEnd: undefined
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

    @observable TolInWorkDays = 0;
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
                EntryDtStart, EntryDtEnd, EntId, TrgtSpId, IntvDtStart, LeaveDtStart, LeaveDtEnd, IntvDtEnd
            },
            pagination: {
                current, pageSize
            }
        } = view;
        view.tableInfo.loading = true;

        let reqParam = {
            EntryDtEnd: EntryDtEnd ? EntryDtEnd.format('YYYY-MM-DD') : '',
            EntryDtStart: EntryDtStart ? EntryDtStart.format('YYYY-MM-DD') : '',
            EntId: EntId || -9999,
            TrgtSpId: TrgtSpId || -9999,
            IntvDtEnd: IntvDtEnd ? IntvDtEnd.format('YYYY-MM-DD') : '',
            IntvDtStart: IntvDtStart ? IntvDtStart.format('YYYY-MM-DD') : '',
            LeaveDtStart: LeaveDtStart ? LeaveDtStart.format('YYYY-MM-DD') : '',
            LeaveDtEnd: LeaveDtEnd ? LeaveDtEnd.format('YYYY-MM-DD') : '',
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };

        try {
            let resData = await InWorkDaysSelect(reqParam);
            view.tableInfo = {
                dataList: resData.Data.RecordList || [],
                loading: false,
                total: resData.Data.RecordCount
            };
            view.TolInWorkDays = resData.Data.TolInWorkDays;
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
}