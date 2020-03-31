import { observable, action } from "mobx";
import { message } from 'antd';
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { tableListQuery, exportData } from 'ADMIN_SERVICE/ZXX_ChatAnalysis';
import moment from 'moment';
export class View extends BaseView {
    @observable searchValue = {
        BeginDay: moment(),
        EndDay: moment(),
        HubName: ''
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
                BeginDay,
                EndDay,
                HubName
            },
            pagination: {
                current, pageSize
            }
        } = view;
        view.tableInfo.loading = true;

        let reqParam = {
            ...view.searchValue,
            BeginDay: BeginDay ? BeginDay.format('YYYY-MM-DD') : '',
            EndDay: EndDay ? EndDay.format('YYYY-MM-DD') : '',
            HubName: HubName,
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };

        try {
            let resData = await tableListQuery(reqParam);

            const { Data: { RecordList, RecordCount } } = resData;
            view.tableInfo = {
                dataList: RecordList || [],
                loading: false,
                total: RecordCount
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
    handleFormReset = () => {
        this.view.resetProperty('searchValue');
    }

    @action
    exportRec = async () => {
        const view = this.view;
        const {
            searchValue: {
                BeginDay,
                EndDay,
                HubName
            }
        } = view;
        view.tableInfo.loading = true;

        let reqParam = {
            ...view.searchValue,
            BeginDay: BeginDay ? BeginDay.format('YYYY-MM-DD') : '',
            EndDay: EndDay ? EndDay.format('YYYY-MM-DD') : '',
            HubName: HubName
        };

        try {
            let resData = await exportData(reqParam);
            window.open(resData.Data.FileUrl);
            view.tableInfo.loading = false;
        } catch (err) {
            message.error(err.message);
            console.log(err);
        }
    }
}