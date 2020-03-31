import { observable, action } from "mobx";
import { message } from 'antd';
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { getMonthyWagePaySetList, updataRowRecord } from 'ADMIN_SERVICE/ZXX_BaseData';
import moment from "moment";
import { toJS } from 'mobx';
export class View extends BaseView {
    @observable searchValue = {
        EnterID: '',
        Day: moment(),
        LaborID: ''
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
    @observable rowInfo = {};
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
                Day, EnterID, LaborID
            },
            pagination: {
                current, pageSize
            }
        } = view;
        view.tableInfo.loading = true;
        let reqParam = {
            ...view.searchValue,
            Day: Day ? Day.format('YYYY-MM-DD') : '',
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize,
            LaborID: LaborID ? LaborID : -9999,
            EnterID: EnterID ? EnterID : -9999
        };
        console.log(reqParam);
        try {
            let resData = await getMonthyWagePaySetList(reqParam);
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
    updataRowRecord = async (data) => {
        this.view.rowInfo = data;
        let { RecordID, IsComplete } = data;
        let { Day } = this.view.searchValue;
        let reqParam = { Day: Day ? Day.format('YYYY-MM-DD') : '', IsComplete: IsComplete === 1 ? 2 : 1, RecordID: RecordID };
        console.log(IsComplete === 1 ? 2 : 1);
        await updataRowRecord(reqParam);
        await this.startQuery();
    }
}