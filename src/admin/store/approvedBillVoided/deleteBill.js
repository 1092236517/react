import { observable, action } from "mobx";
import { message } from 'antd';
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { deleteBill } from 'ADMIN_SERVICE/ZXX_ApprovedBillVoided';

export class View extends BaseView {
    @observable searchValue = {
        BillType: null,
        Condition: ''
    }

    @observable Condition = {
        arr: []
    }

    @observable ConditionString = ""

}

export default class extends BaseViewStore {
    @action
    handleFormValuesChange = (values) => {
        console.log(values);
        this.view.searchValue = values;
    }

    @action
    deleteBills = async() => {
        const view = this.view;
        let length = view.Condition.arr.length;
        let values = view.searchValue;
        let value = '';
        for (let i = 0; i < length; i++) {
            value += values[`Condition${i}`] + ',';
        }
        let Condition = view.searchValue.Condition + ',' + value;
        let params = {
            BillType: parseInt(view.searchValue.BillType, 10),
            Condition: Condition.slice(0, Condition.lastIndexOf(','))
        };
        try {
            let resData = await deleteBill(params);
            message.success('作废成功');
        } catch (err) {
            message.error(err.message);
            console.log(err);
        }
    }

    @action
    addCondition = () => {
        const view = this.view;
        let arr = view.Condition.arr;
        let item = {
            Condition: ''
        };
        arr.push(item);
        view.Condition.arr = arr;
    }

    @action
    deleteCondition = (index) => {
        const view = this.view;
        let arr = view.Condition.arr;
        arr.splice(index, 1);
        view.Condition.arr = arr;
    }

}
