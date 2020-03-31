import { observable, action } from 'mobx';
import { message } from 'antd';
import { BaseView, BaseViewStore } from '../BaseViewStore';
import moment from 'moment';
import { listWeekSalary, listWeekSalaryDetail } from 'ADMIN_SERVICE/ZXX_KanBan';
import { tableMoneyRender } from 'ADMIN_UTILS/tableItemRender';

export class View extends BaseView {
    @observable searchValue = {
        BeginDt: moment().subtract(4, 'weeks'),
        EndDt: moment(),
        CycleTyp: 2
    }

    @observable chartData = [];

    //  chart or table
    @observable showMode = 'chart';
    //  workCount:在职人数  zxxCount:周薪人数    zxxSalary:周薪总额
    @observable tableSourceType = 'workCount';

    @observable originTableData = {
        OnWorkStrTime: [],
        OnWorkDetail: [],
        WeekerStrTime: [],
        WeekerDetail: [],
        WeeklySalaryStrTime: [],
        WeeklySalaryDetail: []
    };
    @observable tableLoading = false;
}

export default class extends BaseViewStore {
    @action
    startQuery = async () => {
        const view = this.view;

        const {
            searchValue: {
                BeginDt, EndDt, CycleTyp
            },
            showMode
        } = view;

        let reqParam = {
            BeginDt: BeginDt ? BeginDt.format('YYYY-MM-DD') : '',
            EndDt: EndDt ? EndDt.format('YYYY-MM-DD') : '',
            CycleTyp
        };

        try {
            view.tableLoading = true;
            const requestFunc = showMode == 'chart' ? listWeekSalary : listWeekSalaryDetail;
            const resData = await requestFunc(reqParam);
            view.tableLoading = false;
            if (showMode == 'chart') {
                view.chartData = resData.Data.RecordList || [];
            } else if (showMode == 'table') {
                const { OnWorkDetail, OnWorkStrTime, WeekerDetail, WeekerStrTime, WeeklySalaryDetail, WeeklySalaryStrTime } = resData.Data;
                view.originTableData = {
                    OnWorkDetail: OnWorkDetail || [],
                    OnWorkStrTime: OnWorkStrTime || [],
                    WeekerDetail: WeekerDetail || [],
                    WeekerStrTime: WeekerStrTime || [],
                    WeeklySalaryDetail: WeeklySalaryDetail || [],
                    WeeklySalaryStrTime: WeeklySalaryStrTime || []
                };
            }
        } catch (err) {
            view.tableLoading = false;
            message.error(err.message);
            console.log(err);
        }
    }

    @action
    handleFormValuesChange = (changedValues, values) => {
        const view = this.view;
        view.searchValue = values;
        const CycleTyp = changedValues['CycleTyp'];
        //  修改默认时间范围
        if (CycleTyp) {
            view.searchValue.BeginDt = {
                1: moment().subtract(7, 'days'),
                2: moment().subtract(4, 'weeks'),
                3: moment().subtract(4, 'months'),
                4: moment().subtract(4, 'years')
            }[CycleTyp];
        }
        this.startQuery();
        window._czc.push(['_trackEvent', '周薪统计', { 1: '按日查询', 2: '按周查询', 3: '按月查询', 4: '按年查询' }[CycleTyp], '周薪统计_N非结算']);
    }

    @action
    changeShowMode = () => {
        const { showMode } = this.view;
        this.view.showMode = showMode == 'chart' ? 'table' : 'chart';
        this.startQuery();
        window._czc.push(['_trackEvent', '周薪统计', showMode == 'chart' ? '切换成图形显示' : '切换成表格显示', '周薪统计_N非结算']);
    }

    @action
    changeDataSource = (type) => {
        this.view.tableSourceType = type;
        window._czc.push(['_trackEvent', '周薪统计', { workCount: '点击在职人数按钮', zxxCount: '点击周薪人数按钮', zxxSalary: '点击周薪总额按钮' }[type], '周薪统计_N非结算']);
    }

    @action
    exportRec = async () => {
        //  3个sheet，在职人数、周薪人数、周薪总额
        const {
            originTableData: {
                OnWorkDetail,
                OnWorkStrTime,
                WeekerDetail,
                WeekerStrTime,
                WeeklySalaryStrTime,
                WeeklySalaryDetail
            }
        } = this.view;

        const workCountData = OnWorkDetail.map(({ TrgtSpShortName, EntShortName, DataCountMap }) => {
            const colObj = OnWorkStrTime.reduce((prev, curr) => {
                prev[curr] = DataCountMap[curr] || 0;
                return prev;
            }, {});
            return {
                '劳务': TrgtSpShortName,
                '企业': EntShortName,
                ...colObj
            };
        });

        const zxxCountData = WeekerDetail.map(({ TrgtSpShortName, EntShortName, DataCountMap }) => {
            const colObj = WeekerStrTime.reduce((prev, curr) => {
                prev[curr] = DataCountMap[curr] || 0;
                return prev;
            }, {});
            return {
                '劳务': TrgtSpShortName,
                '企业': EntShortName,
                ...colObj
            };
        });

        const zxxSalaryData = WeeklySalaryDetail.map(({ TrgtSpShortName, EntShortName, DataCountMap }) => {
            const colObj = WeeklySalaryStrTime.reduce((prev, curr) => {
                prev[curr] = tableMoneyRender(DataCountMap[curr] || 0);
                return prev;
            }, {});
            return {
                '劳务': TrgtSpShortName,
                '企业': EntShortName,
                ...colObj
            };
        });

        try {
            const xlsx = await import('xlsx');
            const ws1 = xlsx.utils.json_to_sheet(workCountData);
            const ws2 = xlsx.utils.json_to_sheet(zxxCountData);
            const ws3 = xlsx.utils.json_to_sheet(zxxSalaryData);

            const wb = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(wb, ws1, '在职人数');
            xlsx.utils.book_append_sheet(wb, ws2, '周薪人数');
            xlsx.utils.book_append_sheet(wb, ws3, '周薪总额');

            xlsx.writeFile(wb, '周薪薪统计.xlsx');
        } catch (err) {
            message.error(err.message);
            console.log(err);
        }
    }
}