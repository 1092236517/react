import { observable, action } from "mobx";
import { message } from 'antd';
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { listFile } from 'ADMIN_SERVICE/ZXX_FileMgr';

export class View extends BaseView {
    @observable searchValue = {
        BeginUploadDate: undefined,
        EndUploadDate: undefined,
        AuditState: -9999,
        EnterID: undefined,
        FileType: -9999,
        LaborID: undefined,
        Month: undefined
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
            searchValue: {
                BeginUploadDate, EndUploadDate, AuditState, EnterID, FileType, LaborID, Month
            },
            pagination: {
                current, pageSize
            }
        } = view;

        let reqParam = {
            BeginUploadDate: BeginUploadDate ? BeginUploadDate.format('YYYY-MM-DD') : '',
            EndUploadDate: EndUploadDate ? EndUploadDate.format('YYYY-MM-DD') : '',
            AuditState,
            EnterID: EnterID || -9999,
            FileType,
            LaborID: LaborID || -9999,
            Month: Month ? Month.format('YYYY-MM') : '',
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };

        try {
            view.tableInfo.loading = true;

            let resData = await listFile(reqParam);
            let { Data: { RecordList = [], RecordCount } } = resData;

            view.tableInfo = {
                dataList: RecordList,
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
    setPagination = (current, pageSize) => {
        let view = this.view;
        view.pagination = {
            current,
            pageSize
        };
        this.startQuery();
    }

    @action
    handleFormValuesChange = (values) => {
        this.view.searchValue = values;
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
            selectedRowKeys
        };
    }

    @action
    handleFormReset = () => {
        this.view.resetProperty('searchValue');
    }
}