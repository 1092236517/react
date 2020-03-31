import { InWorkDaysByCycleSelect } from 'ADMIN_SERVICE/ZXX_KanBan';
import { message } from 'antd';
import { action, observable } from "mobx";
import moment from 'moment';
import { BaseView, BaseViewStore } from "../BaseViewStore";

export class View extends BaseView {
    @observable searchValue = {
        StartDt: moment().subtract(1, 'months'),
        EndDt: moment()
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
                StartDt, EndDt
            },
            pagination: {
                current, pageSize
            }
        } = view;
        view.tableInfo.loading = true;

        let reqParam = {
            EndDt: EndDt ? EndDt.format('YYYY-MM-DD') : '',
            StartDt: StartDt ? StartDt.format('YYYY-MM-DD') : '',
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };
        try {
            let resData = await InWorkDaysByCycleSelect(reqParam);
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