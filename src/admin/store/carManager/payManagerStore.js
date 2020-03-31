import { observable, action } from "mobx";
import { message } from 'antd';
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { getXXCPayResult, exportXXCPayResult } from 'ADMIN_SERVICE/ZXX_carManager';

export class View extends BaseView {
    @observable searchValue = {
        PaySts: undefined,
        PayTimeEnd: undefined,
        PayTimeStart: undefined,
        SelectParam: ''
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
                PaySts, PayTimeStart, PayTimeEnd, SelectParam
            },
            pagination: {
                current, pageSize
            }
        } = view;

        let reqParam = {
            ...view.searchValue,
            PaySts: PaySts || -9999,
            PayTimeStart: PayTimeStart ? PayTimeStart.format('YYYY-MM-DD') : '',
            PayTimeEnd: PayTimeEnd ? PayTimeEnd.format('YYYY-MM-DD') : '',
            SelectParam: SelectParam,
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };

        try {
            view.tableInfo.loading = true;
            let resData = await getXXCPayResult(reqParam);
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
    exportRec = async () => {
        const view = this.view;
        const {
            searchValue: {
                PaySts, PayTimeStart, PayTimeEnd, SelectParam
            },
            pagination: {
                current, pageSize
            }
        } = view;

        let reqParam = {
            ...view.searchValue,
            PaySts: PaySts || -9999,
            PayTimeStart: PayTimeStart ? PayTimeStart.format('YYYY-MM-DD') : '',
            PayTimeEnd: PayTimeEnd ? PayTimeEnd.format('YYYY-MM-DD') : '',
            SelectParam: SelectParam,
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };

        try {
            let resData = await exportXXCPayResult(reqParam);
            window.open(resData.Data.FileUrl);
        } catch (err) {
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
}