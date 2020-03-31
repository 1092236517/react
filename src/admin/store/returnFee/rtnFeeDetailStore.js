import { observable, action } from "mobx";
import { message } from 'antd';
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { expDetail, listDetail } from 'ADMIN_SERVICE/ZXX_ReturnFee';

export class View extends BaseView {
    @observable searchValue = {
        EntId: undefined,
        IdCardNum: '',
        ImportDtEnd: undefined,
        ImportDtStart: undefined,
        IsSend: -9999,
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
        selectedRowKeys: [],
        total: 0
    };
}

export default class extends BaseViewStore {
    @action
    startQuery = async () => {
        const view = this.view;
        const {
            searchValue: { EntId, IdCardNum, ImportDtEnd, ImportDtStart, IsSend, RealName, TrgtSpId, SettlementTyp },
            pagination: { current, pageSize }
        } = view;

        let reqParam = {
            EntId: EntId || -9999,
            IdCardNum,
            ImportDtEnd: ImportDtEnd ? ImportDtEnd.format('YYYY-MM-DD') : '',
            ImportDtStart: ImportDtStart ? ImportDtStart.format('YYYY-MM-DD') : '',
            IsSend,
            RealName,
            TrgtSpId: TrgtSpId || -9999,
            SettlementTyp,
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };

        try {
            view.tableInfo.loading = true;
            let resData = await listDetail(reqParam);
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
        const { EntId, IdCardNum, ImportDtEnd, ImportDtStart, IsSend, RealName, TrgtSpId, SettlementTyp } = view.searchValue;

        let reqParam = {
            EntId: EntId || -9999,
            IdCardNum,
            ImportDtEnd: ImportDtEnd ? ImportDtEnd.format('YYYY-MM-DD') : '',
            ImportDtStart: ImportDtStart ? ImportDtStart.format('YYYY-MM-DD') : '',
            IsSend,
            RealName,
            TrgtSpId: TrgtSpId || -9999,
            SettlementTyp
        };

        try {
            let resData = await expDetail(reqParam);
            const { Data: { FileUrl } } = resData;
            window.open(FileUrl);
        } catch (err) {
            message.error(err.message);
            console.log(err);
        }
    }

    @action
    handleFormValuesChange = (values) => {
        this.view.searchValue = {...values};
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
}