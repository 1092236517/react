import { observable, action } from "mobx";
import { message } from 'antd';
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { getWeeklyWageImportList, exportWeeklyWageImportRecord, getWeeklyWageExportRes } from 'ADMIN_SERVICE/ZXX_WeekBill';

export class View extends BaseView {
    @observable searchValue = {
        BeginDt: undefined,
        EndDt: undefined,
        EntId: undefined,
        TrgtSpId: undefined,
        SrceSpId: undefined,
        IdCardNum: '',
        RealName: '',
        WorkSts: -9999,
        BillSrce: -9999,
        LaborConfirmedAmt: -9999,
        UpdatedTmBegin: undefined,
        UpdatedTmEnd: undefined,
        CreatedByName: ''
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

    //  前台轮询查询后台结果，id
    @observable schedulerID = '';
}

export default class extends BaseViewStore {
    @action
    handleFormValuesChange = (values) => {
        this.view.searchValue = values;
    }

    @action
    startQuery = async () => {
        const view = this.view;
        const {
            searchValue: {
                BeginDt, EndDt, EntId, SrceSpId, TrgtSpId, IdCardNum, RealName, WorkSts, BillSrce, LaborConfirmedAmt, UpdatedTmBegin, UpdatedTmEnd, CreatedByName
            },
            pagination: {
                current, pageSize
            }
        } = view;
        view.tableInfo.loading = true;

        let reqParam = {
            BeginDt: BeginDt ? BeginDt.format('YYYY-MM-DD') : '',
            BillSrce,
            UpdatedTmBegin: UpdatedTmBegin ? UpdatedTmBegin.format('YYYY-MM-DD HH:mm') : '',
            UpdatedTmEnd: UpdatedTmEnd ? UpdatedTmEnd.format('YYYY-MM-DD HH:mm') : '',
            EndDt: EndDt ? EndDt.format('YYYY-MM-DD') : '',
            EntId: EntId || -9999,
            IdCardNum,
            LaborConfirmedAmt,
            RealName,
            SrceSpId: SrceSpId || -9999,
            TrgtSpId: TrgtSpId || -9999,
            WorkSts,
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize,
            CreatedByName: CreatedByName
        };

        try {
            let resData = await getWeeklyWageImportList(reqParam);
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

    //  设置分页
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
    exportRecord = async () => {
        const view = this.view;
        const { BeginDt, EndDt, EntId, SrceSpId, TrgtSpId, IdCardNum, RealName, WorkSts, BillSrce, LaborConfirmedAmt, UpdatedTmBegin, UpdatedTmEnd, CreatedByName } = view.searchValue;

        let reqParam = {
            BeginDt: BeginDt ? BeginDt.format('YYYY-MM-DD') : '',
            BillSrce,
            UpdatedTmBegin: UpdatedTmBegin ? UpdatedTmBegin.format('YYYY-MM-DD HH:mm') : '',
            UpdatedTmEnd: UpdatedTmEnd ? UpdatedTmEnd.format('YYYY-MM-DD HH:mm') : '',
            EndDt: EndDt ? EndDt.format('YYYY-MM-DD') : '',
            EntId: EntId || -9999,
            IdCardNum,
            LaborConfirmedAmt,
            RealName,
            SrceSpId: SrceSpId || -9999,
            TrgtSpId: TrgtSpId || -9999,
            WorkSts,
            CreatedByName: CreatedByName
        };

        try {
            let resData = await exportWeeklyWageImportRecord(reqParam);
            const { Data: { BizID } } = resData;
            this.getWeeklyWageExportRes(BizID);
            view.schedulerID = setInterval(() => {
                this.getWeeklyWageExportRes(BizID);
            }, 2000);
        } catch (err) {
            message.error(err.message);
            console.log(err);
        }
    }

    @action
    getWeeklyWageExportRes = async (BizID) => {
        const view = this.view;
        let reqParam = { BizID };
        try {
            let resData = await getWeeklyWageExportRes(reqParam);
            const { State, FileUrl, TaskCode, TaskDesc } = resData.Data;

            if (State == 0) {
                //    未完成
                message.loading('正在导出记录请稍候！');
            } else {
                //  已完成
                window.clearInterval(view.schedulerID);
                view.schedulerID = '';
                if (TaskCode == 0) {
                    window.open(FileUrl);
                } else {
                    message.error(TaskDesc);
                }
            }
        } catch (err) {
            window.clearInterval(view.schedulerID);
            view.schedulerID = '';
            message.error(err.message);
            console.log(err);
        }
    }
}