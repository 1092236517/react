import { observable, action } from "mobx";
import { message } from 'antd';
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { listEntLaborMap, modifyPayType } from 'ADMIN_SERVICE/ZXX_BaseData';

export class View extends BaseView {
    @observable searchValue = {
        EnterID: undefined,
        LaborID: undefined,
        MonthSalaryPayer: -9999
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
    startQuery = async () => {
        const view = this.view;
        const {
            searchValue: { EnterID, LaborID },
            pagination: { current, pageSize }
        } = view;

        let reqParam = {
            ...view.searchValue,
            EnterID: EnterID || -9999,
            LaborID: LaborID || -9999,
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };

        try {
            view.tableInfo.loading = true;
            let resData = await listEntLaborMap(reqParam);
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
    handleFormValuesChange = (values) => {
        this.view.searchValue = { ...values };
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
    setSelectRowKeys = (selectedRowKeys) => {
        this.view.tableInfo = {
            ...this.view.tableInfo,
            ...{
                selectedRowKeys: selectedRowKeys
            }
        };
    }

    @action
    resetForm = () => {
        this.view.resetProperty('searchValue');
    }
    @action
    modifyPayType = async (data) => {
        const { EnterID, LaborID, MonthSalaryPayer } = data;
        let reqParam = {
            EnterID: EnterID || -9999,
            LaborID: LaborID || -9999,
            SalaryPlayer: MonthSalaryPayer === 1 ? 2 : 1
        };

        try {
            await modifyPayType(reqParam);
            await this.startQuery();
        } catch (err) {
            message.error(err.message);
            console.log(err);
        }
    }

}