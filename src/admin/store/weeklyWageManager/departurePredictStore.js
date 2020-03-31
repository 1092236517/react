import { observable, action } from "mobx";
import { message } from 'antd';
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { getQueryWorkStsList, exportReturnFeePredictRecord, runWorkStsList, getcalculatRes } from 'ADMIN_SERVICE/ZXX_WeekReturnFeePredict';
import moment from 'moment';
export class View extends BaseView {
    @observable searchValue = {
        SettleBeginDt: moment().subtract(moment().day() + 7 + (moment().day() < 1 ? 7 : 0), 'days'),
        SettleEndDt: moment().subtract(moment().day() - 6 + 7 + (moment().day() < 1 ? 7 : 0), 'days'),
        EntId: undefined,
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
        ClockNgTimes: 0,
        ClockOkTimes: 0,
        NewEntryNum: 0,
        OldEntryNum: 0
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
                EntId, TrgtSpId, SettleBeginDt, SettleEndDt
            },
            pagination: {
                current, pageSize
            }
        } = view;
        view.tableInfo.loading = true;
        view.tableInfo = {
            dataList: []
        };
        let reqParam = {
            SettleBeginDt: SettleBeginDt ? SettleBeginDt.format('YYYY-MM-DD') : '',
            SettleEndDt: SettleEndDt ? SettleEndDt.format('YYYY-MM-DD') : '',
            EntId: EntId || -9999,
            TrgtSpId: TrgtSpId || -9999,
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };

        try {
            let resData = await getQueryWorkStsList(reqParam);
            view.tableInfo = {
                dataList: resData.Data.RecordList || [],
                loading: false,
                total: resData.Data.RecordCount,
                ClockNgTimes: resData.Data.ClockNgTimes,
                ClockOkTimes: resData.Data.ClockOkTimes,
                NewEntryNum: resData.Data.NewEntryNum,
                OldEntryNum: resData.Data.OldEntryNum
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
        const {
            searchValue: {
                EntId, TrgtSpId, SettleBeginDt, SettleEndDt
            },
            pagination: {
                current, pageSize
            }
        } = view;
        view.tableInfo.loading = true;
        let reqParam = {
            SettleBeginDt: SettleBeginDt ? SettleBeginDt.format('YYYY-MM-DD') : '',
            SettleEndDt: SettleEndDt ? SettleEndDt.format('YYYY-MM-DD') : '',
            EntId: EntId || -9999,
            TrgtSpId: TrgtSpId || -9999,
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };

        try {
            let resData = await exportReturnFeePredictRecord(reqParam);
            view.tableInfo.loading = false;
            window.open(resData.Data.FileUrl);
        } catch (err) {
            message.error(err.message);
            console.log(err);
        }


    }
    @action
    calculateOption = async () => {
        const view = this.view;
        const {
            searchValue: {
                EntId, TrgtSpId, SettleBeginDt, SettleEndDt
            },
            pagination: {
                current, pageSize
            }
        } = view;
        view.tableInfo.loading = true;
        let reqParam = {
            SettleBeginDt: SettleBeginDt ? SettleBeginDt.format('YYYY-MM-DD') : '',
            SettleEndDt: SettleEndDt ? SettleEndDt.format('YYYY-MM-DD') : '',
            EntId: EntId || -9999,
            TrgtSpId: TrgtSpId || -9999,
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };

        try {
            let resData = await runWorkStsList(reqParam);
            const { Data: { BizID } } = resData;
            this.getPreDirectRes(BizID);
            view.schedulerID = setInterval(() => {
                this.getPreDirectRes(BizID);
            }, 2000);
        } catch (err) {
            message.error(err.message);
            console.log(err);
        }

    }

    @action
    getPreDirectRes = async (BizID) => {
        const view = this.view;
        let reqParam = { BizID };
        try {
            let resData = await getcalculatRes(reqParam);
            const { State, TaskCode, TaskDesc } = resData.Data;

            if (State == 0) {
                //    未完成
                message.loading('正在执行计算请稍候！');
            } else {
                //  已完成
                window.clearInterval(view.schedulerID);
                view.tableInfo.loading = false;
                view.schedulerID = '';
                if (TaskCode == 0) {
                    this.startQuery();
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