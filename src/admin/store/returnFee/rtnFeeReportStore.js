import { observable, action } from "mobx";
import { message } from 'antd';
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { listReport, expReport } from 'ADMIN_SERVICE/ZXX_ReturnFee';

export class View extends BaseView {
    @observable searchValue = {
        EntId: undefined,
        IdCardNum: '',
        IsOver: -9999,
        RealName: '',
        TrgtSpId: undefined,
        SettlementTyp: -9999
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
            searchValue: { EntId, TrgtSpId },
            pagination: {
                current, pageSize
            }
        } = view;

        let reqParam = {
            ...view.searchValue,
            EntId: EntId || -9999,
            TrgtSpId: TrgtSpId || -9999,
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };

        try {
            view.tableInfo.loading = true;
            let resData = await listReport(reqParam);
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
    exportRecord = async () => {
        const view = this.view;
        const { EntId, TrgtSpId } = view.searchValue;

        let reqParam = {
            ...view.searchValue,
            EntId: EntId || -9999,
            TrgtSpId: TrgtSpId || -9999
        };

        try {
            let resData = await expReport(reqParam);
            const { Data: { FileUrl } } = resData;
            window.open(FileUrl);
        } catch (err) {
            message.error(err.message);
            console.log(err);
        }
    }

    @action
    handleFormValuesChange = (values) => {
        this.view.searchValue = {
            ...values
        };
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