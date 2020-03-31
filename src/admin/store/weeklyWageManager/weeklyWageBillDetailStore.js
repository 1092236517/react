import { observable, action } from "mobx";
import { message } from 'antd';
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { getWeeklyWageBillDetailList, exportWeeklyWageBillDetailList } from 'ADMIN_SERVICE/ZXX_WeekBill';

export class View extends BaseView {
    @observable batchID = '';
    @observable from = '';

    @observable searchValue = {
        RealName: '',
        IdCardNum: '',
        WorkSts: -9999
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
                RealName, IdCardNum, WorkSts
            },
            pagination: {
                current, pageSize
            }
         } = view;
        view.tableInfo.loading = true;

        let reqParam = {
            IdCardNum,
            RealName,
            WorkSts,
            BillWeeklyBatchId: this.view.batchID * 1,
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };

        try {
            let resData = await getWeeklyWageBillDetailList(reqParam);

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
    setBatchID = (batchID) => {
        this.view.batchID = batchID;
    }

    @action
    setFrom = (from) => {
        this.view.from = from;
    }

    @action
    exportRecord = async () => {
        const view = this.view;
        const { RealName, IdCardNum, WorkSts } = view.searchValue;

        let reqParam = {
            IdCardNum,
            RealName,
            WorkSts,
            BillWeeklyBatchId: this.view.batchID * 1
        };

        try {
            let resData = await exportWeeklyWageBillDetailList(reqParam);
            window.open(resData.Data.FileUrl);
        } catch (err) {
            message.error(err.message);
            console.log(err);
        }
    }
}