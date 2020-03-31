import { observable, action } from "mobx";
import { message } from 'antd';
import moment from 'moment';
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { getClockStatistic, exportClockStatistic } from 'ADMIN_SERVICE/ZXX_Clock';

export class View extends BaseView {
    @observable searchValue = {
        StartDt: moment().clone().subtract(8, 'days'),
        EndDt: moment().clone().subtract(1, 'days'),
        EntId: undefined
    }

    tableDefaultColumns = [
        ['EntShortName', '企业', (value, row) => {
            if (row.RowID == -9999) {
                return '合计';
            }
            
            return value.AllCount;
        }]
    ]

    @observable tableInfo = {
        dataList: [],
        loading: false,
        total: 0,
        columnsMap: [...this.tableDefaultColumns]
    };
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
                StartDt, EndDt, EntId
            }
        } = view;

        let reqParam = {
            StartDt: StartDt.format('YYYY-MM-DD'),
            EndDt: EndDt.format('YYYY-MM-DD'),
            EntId: EntId || -9999
        };

        try {
            view.tableInfo.loading = true;
            let resData = await getClockStatistic(reqParam);
            const { RecordList = [], ClockCalc } = resData.Data;
            let dataList = RecordList.slice();
            dataList.forEach((record, index) => {
                record.RowID = index;
            });
            //  添加最后一行打卡的数据
            dataList.unshift({
                RowID: -9999,
                ...ClockCalc
            });

            view.tableInfo = {
                columnsMap: [...view.tableDefaultColumns, ...this.generateColumnsByDate(StartDt, EndDt)],
                dataList,
                loading: false,
                total: resData.Data.RecordCount
            };
        } catch (err) {
            view.tableInfo.loading = false;
            message.error(err.message);
            console.log(err);
        }
    }

    generateColumnsByDate = (startDT, endDT) => {
        let res = [];
        for (let nowDT = startDT.clone(); nowDT.isBefore(endDT.clone().add(1, 'days'), 'days'); nowDT.add(1, 'days')) {
            res.push([nowDT.format('YYYY-MM-DD'), nowDT.format('YYYY-MM-DD') + '  ' + moment.weekdays()[nowDT.day()], (val, record) => {
                console.log('record.EntShortName', record.EntShortName);
                if(record.EntShortName && record.EntShortName.AllCount == '无劳务') {
                    return val.AllCount;
                }
                return `${val.ValCount}/${val.AllCount}`;
            }, 150]);
        }
        return res;
    }

    @action
    exportRecord = async () => {
        const view = this.view;
        const { StartDt, EndDt, EntId } = view.searchValue;

        let reqParam = {
            StartDt: StartDt ? StartDt.format('YYYY-MM-DD') : '',
            EndDt: EndDt ? EndDt.format('YYYY-MM-DD') : '',
            EntId: EntId || -9999
        };

        try {
            let resData = await exportClockStatistic(reqParam);
            window.open(resData.Data.FileUrl);
        } catch (err) {
            message.error(err.message);
            console.log(err);
        }
    }

    @action
    resetForm = () => {
        this.view.resetProperty('searchValue');
    }
}