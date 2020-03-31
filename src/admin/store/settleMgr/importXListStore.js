import { observable, action } from "mobx";
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { message } from 'antd';
import { listImpX, exportImpXDetails, getExpRes } from 'ADMIN_SERVICE/ZXX_XManager';
import moment from 'moment';

export class View extends BaseView {
    @observable searchValue = {
        BeginImportDate: undefined,
        BeginMonth: undefined,
        EndImportDate: undefined,
        EndMonth: undefined,
        IDCardNum: '',
        RealName: '',
        AuditStatus: -9999,
        EnterpriseID: undefined,
        IsOK: -9999,
        LaborID: undefined,
        XType: -9999,
        WorkSts: -9999,
        SettlementTyp: -9999
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

    @observable attachInfo = {
        AuditPassUserCount: 0,
        AuditPassXAmount: 0,
        AuditRejectUserCount: 0,
        AuditRejectXAmount: 0,
        UnAuditUserCount: 0,
        UnAuditXAmount: 0,
        TotalXSalaryAmount: 0,
        TotalXSocialAmount: 0,
        TotalXManageFeeAmount: 0,
        TotalXRecruitmentFeeAmount: 0,
        TotalXLeaveAmount: 0,
        TotalXOtherAmount: 0
    }
}

export default class extends BaseViewStore {
    @action
    startQuery = async (extraParams) => {
        const view = this.view;
        if (extraParams) {
            const { BeginMonth, EndMonth, AuditStatus } = extraParams;
            view.searchValue = {
                ...view.searchValue,
                ...extraParams,
                BeginMonth: BeginMonth ? moment(BeginMonth) : moment(),
                EndMonth: EndMonth ? moment(EndMonth) : moment(),
                AuditStatus: AuditStatus ? AuditStatus : -9999
            };
        }

        const { searchValue, pagination } = view;
        const { current, pageSize } = pagination;
        const { BeginImportDate, BeginMonth, EndImportDate, EndMonth, LaborID, EnterpriseID } = searchValue;

        let reqParam = {
            ...searchValue,
            BeginImportDate: BeginImportDate ? BeginImportDate.format('YYYY-MM-DD') : '',
            BeginMonth: BeginMonth ? BeginMonth.format('YYYY-MM') : '',
            EndImportDate: EndImportDate ? EndImportDate.format('YYYY-MM-DD') : '',
            EndMonth: EndMonth ? EndMonth.format('YYYY-MM') : '',
            EnterpriseID: EnterpriseID || -9999,
            LaborID: LaborID || -9999,
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };

        try {
            view.tableInfo.loading = true;
            let resData = await listImpX(reqParam);

            const {
                Data: {
                    RecordList, RecordCount, ...attachInfo
                }
            } = resData;

            view.tableInfo = {
                dataList: RecordList || [],
                loading: false,
                total: RecordCount,
                selectedRowKeys: [],
                selectedRows: []
            };

            view.attachInfo = attachInfo;
        } catch (err) {
            view.tableInfo.loading = false;
            message.error(err.message);
            console.log(err);
        }
    }

    @action
    exportTB = async () => {
        const view = this.view;
        const { searchValue } = view;
        const { BeginImportDate, BeginMonth, EndImportDate, EndMonth, LaborID, EnterpriseID } = searchValue;

        let reqParam = {
            ...searchValue,
            BeginImportDate: BeginImportDate ? BeginImportDate.format('YYYY-MM-DD') : '',
            BeginMonth: BeginMonth ? BeginMonth.format('YYYY-MM') : '',
            EndImportDate: EndImportDate ? EndImportDate.format('YYYY-MM-DD') : '',
            EndMonth: EndMonth ? EndMonth.format('YYYY-MM') : '',
            EnterpriseID: EnterpriseID || -9999,
            LaborID: LaborID || -9999
        };

        try {
            let resData = await exportImpXDetails(reqParam);
            const { Data: { BizID } } = resData;
            this.getExportRes(BizID);
            this.schedulerID = setInterval(() => {
                this.getExportRes(BizID);
            }, 2000);
        } catch (err) {
            message.error(err.message);
            console.log(err);
        }
    }

    getExportRes = async (BizID) => {
        let reqParam = { BizID };
        try {
            let resData = await getExpRes(reqParam);
            const { State, FileUrl, TaskCode, TaskDesc } = resData.Data;

            if (State == 0) {
                //    未完成
                message.loading('正在导出记录请稍候！');
            } else {
                //  已完成
                window.clearInterval(this.schedulerID);
                this.schedulerID = '';
                if (TaskCode == 0) {
                    window.open(FileUrl);
                } else {
                    message.error(TaskDesc);
                }
            }
        } catch (err) {
            window.clearInterval(this.schedulerID);
            this.schedulerID = '';
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
                selectedRowKeys,
                selectedRows
            }
        };
    }
}