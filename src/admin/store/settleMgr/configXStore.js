import { observable, action } from "mobx";
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { listConfigX } from 'ADMIN_SERVICE/ZXX_XManager';
import { message } from 'antd';

export class View extends BaseView {
    @observable searchValue = {
        EntId: undefined,
        LaborId: undefined,
        IsDisable: -9999,
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
        selectedRowKeys: []
    };
}

export default class extends BaseViewStore {
    @action
    startQuery = async () => {
        const view = this.view;
        const {
            searchValue: {
                EntId, LaborId, AuditSts, IsDisable
            },
            pagination: {
                current, pageSize
            }
        } = view;

        let reqParam = {
            AuditSts: AuditSts,
            IsDisable: IsDisable * 1,
            EntId: EntId || -9999,
            LaborId: LaborId || -9999,
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };

        try {
            view.tableInfo.loading = true;
            let resData = await listConfigX(reqParam);
            const { Data: { RecordList, RecordCount } } = resData;
            view.tableInfo = {
                dataList: RecordList || [],
                loading: false,
                total: RecordCount,
                selectedRowKeys: []
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
    setSelectRowKeys = (selectedRowKeys) => {
        this.view.tableInfo = {
            ...this.view.tableInfo,
            ...{
                selectedRowKeys: selectedRowKeys
            }
        };
    }

}