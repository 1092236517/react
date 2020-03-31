import { observable, action } from "mobx";
import { message } from 'antd';
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { getRemindReceiverList } from 'ADMIN_SERVICE/ZXX_BaseData';

export class View extends BaseView {
    @observable modalValue = {
        IsValid: -9999,
        Mobile: undefined,
        RealName: '',
        RecordID: ''
    };
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
    @observable isShowModal = false;
}

export default class extends BaseViewStore {
    @action
    startQuery = async () => {
        const view = this.view;
        const {
            pagination: { current, pageSize }
        } = view;

        let reqParam = {
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };

        try {
            view.tableInfo.loading = true;
            let resData = await getRemindReceiverList(reqParam);
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
        this.view.modalValue = { ...values };
        console.log({ ...values });
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
    setModalShow = () => {
        this.view.isShowModal = true;
    }
    @action
    setModalHide = () => {
        this.view.isShowModal = false;
    }


}