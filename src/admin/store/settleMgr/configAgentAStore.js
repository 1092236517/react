import { observable, action } from "mobx";
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { message } from 'antd';
import { listConfigAgentA } from 'ADMIN_SERVICE/ZXX_XManager';

export class View extends BaseView {
    @observable searchValue = {
        EntId: undefined,
        LaborId: undefined,
        AuditSts: -9999
    }

    @observable pagination = {
        current: 1,
        pageSize: 10
    }

    @observable tableInfo = {
        dataList: [],
        loading: false,
        total: 0,
        selectedRowKeys: [],
        selectedRows: []
    };
}

export default class extends BaseViewStore {
    @action
    startQuery = async () => {
        const view = this.view;
        const {
            searchValue: {
                EntId, LaborId, AuditSts
            },
            pagination: {
                current, pageSize
            }
        } = view;

        let reqParam = {
            EntId: EntId || -9999,
            LaborId: LaborId || -9999,
            AuditSts,
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };

        try {
            view.tableInfo.loading = true;
            let resData = await listConfigAgentA(reqParam);

            const { Data: { RecordList, RecordCount } } = resData;
            view.tableInfo = {
                dataList: RecordList || [],
                loading: false,
                total: RecordCount,
                selectedRowKeys: [],
                selectedRows: []
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

    @action
    setSelectRowKeys = (selectedRowKeys, selectedRows) => {
        this.view.tableInfo = {
            ...this.view.tableInfo,
            ...{
                selectedRowKeys: selectedRowKeys,
                selectedRows: selectedRows
            }
        };
    }
}