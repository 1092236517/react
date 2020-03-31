import { observable, action } from "mobx";
import { message } from 'antd';
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { ProgressOfPay } from 'ADMIN_SERVICE/ZXX_WeekBill';


export class View extends BaseView {


    @observable tableInfo = {
        dataList: [],
        loading: false,
        total: 0
    };
    @observable rowCount = 0;
    @observable pepoleCount = 0;
}

export default class extends BaseViewStore {

    @action
    startQuery = async () => {
        const view = this.view;
        view.tableInfo.loading = true;

        try {
            let resData = await ProgressOfPay();
            view.tableInfo = {
                dataList: resData.Data.RecordList || [],
                loading: false
            };
            if (resData.Data.RecordList && resData.Data.RecordList.length > 0) {
                view.rowCount = resData.Data.RecordList.length;
                let pepoleCount = 0;
                for (let obj of resData.Data.RecordList) {
                    pepoleCount += obj['PayNumbers'];
                }
                view.pepoleCount = pepoleCount;
            }

        } catch (err) {
            view.tableInfo.loading = false;
            message.error(err.message);
            console.log(err);
        }
    }
}