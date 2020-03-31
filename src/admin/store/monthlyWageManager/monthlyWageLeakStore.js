import { observable, action } from "mobx";
import { message } from 'antd';
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { expMonthlyWageLeak, listMonthlyWageLeak, getMonthlyWageExportRes } from 'ADMIN_SERVICE/ZXX_MonthBill';
import moment from 'moment';

export class View extends BaseView {
    @observable searchValue = {
        // BillMonEnd: moment().subtract(1, 'months'),
        BillMonStart: moment().subtract(1, 'months'),
        OperationSts: -9999,
        EntId: undefined,
        IdCardNum: '',
        RealName: '',
        SrceSpId: undefined,
        TrgtSpId: undefined
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
                BillMonStart, OperationSts, EntId, IdCardNum, RealName, SrceSpId, TrgtSpId
            },
            pagination: {
                current, pageSize
            }
        } = view;

        let reqParam = {
            BillMonStart: BillMonStart ? BillMonStart.format('YYYY-MM') : '',
            OperationSts,
            EntId: EntId || -9999,
            IdCardNum,
            RealName,
            SrceSpId: SrceSpId || -9999,
            TrgtSpId: TrgtSpId || -9999,
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };

        try {
            view.tableInfo.loading = true;
            let resData = await listMonthlyWageLeak(reqParam);

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
    exportData = async () => {
        const view = this.view;
        const {
            searchValue: {
                BillMonStart, OperationSts, EntId, IdCardNum, RealName, SrceSpId, TrgtSpId
            }
        } = view;

        let reqParam = {
            // BillMonEnd: BillMonEnd ? BillMonEnd.format('YYYY-MM') : '',
            BillMonStart: BillMonStart ? BillMonStart.format('YYYY-MM') : '',
            OperationSts,
            EntId: EntId || -9999,
            IdCardNum,
            RealName,
            SrceSpId: SrceSpId || -9999,
            TrgtSpId: TrgtSpId || -9999
        };

        try {
            let resData = await expMonthlyWageLeak(reqParam);
            const { Data: { BizID } } = resData;
            this.getMonthlyExportRes(BizID, 1);
            view.schedulerID = setInterval(() => {
                this.getMonthlyExportRes(BizID, 1);
            }, 2000);

        } catch (err) {
            message.error(err.message);
            console.log(err);
        }
    }


    @action
    getMonthlyExportRes = async (BizID) => {
        const view = this.view;
        let reqParam = { BizID };
        try {
            let resData = await getMonthlyWageExportRes(reqParam);
            const { State, FileUrl, TaskCode, TaskDesc } = resData.Data;

            if (State == 0) {
                //    未完成
                message.loading('正在导出记录请稍候！');
            } else {
                //  已完成
                view.FormListStatus = 'done';
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
            view.FormListStatus = 'error';
            message.error(err.message);
            console.log(err);
        }
    }

}