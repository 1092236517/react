import { observable, action } from "mobx";
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { message } from 'antd';
import { listSettleDetail } from 'ADMIN_SERVICE/ZXX_XManager';

export class View extends BaseView {
    @observable searchValue = {
        EntId: undefined,
        TrgtSpId: undefined,
        BeginDt: undefined,
        EndDt: undefined,
        IdCardNum: '',
        RealName: ''
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

    @observable attachInfo = {
        TolDValue: 0,
        TolX: 0,
        TolY: 0,
        TolZ: 0
    }
}

export default class extends BaseViewStore {
    @action
    startQuery = async () => {
        const view = this.view;
        const {
            searchValue: {
                EntId, TrgtSpId, BeginDt, EndDt, IdCardNum, RealName
            },
            pagination: {
                current, pageSize
            }
        } = view;

        let reqParam = {
            EntId: EntId || -9999,
            TrgtSpId: TrgtSpId || -9999,
            BeginDt: BeginDt ? BeginDt.format('YYYY-MM') : '',
            EndDt: EndDt ? EndDt.format('YYYY-MM') : '',
            IdCardNum,
            RealName,
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };

        try {
            view.tableInfo.loading = true;
            let resData = await listSettleDetail(reqParam);

            const { Data: { RecordList, RecordCount, TolDValue, TolX, TolY, TolZ } } = resData;
            view.tableInfo = {
                dataList: RecordList || [],
                loading: false,
                total: RecordCount
            };
            view.attachInfo = {
                TolDValue, TolX, TolY, TolZ
            };
        } catch (err) {
            view.tableInfo.loading = false;
            message.error(err.message);
            console.log(err);
        }
    }

    @action
    handleFormValuesChange = (values) => {
        this.view.searchValue = values;
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