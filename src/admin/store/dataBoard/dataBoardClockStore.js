import { observable, action } from 'mobx';
import { message } from 'antd';
import { BaseView, BaseViewStore } from '../BaseViewStore';
import moment from 'moment';
import { listClock, listClockDetail } from 'ADMIN_SERVICE/ZXX_KanBan';

export class View extends BaseView {
    @observable searchValue = {
        BeginDt: moment().subtract(7, 'days'),
        EndDt: moment(),
        CycleTyp: 1
    }

    @observable chartData = [];

    //  chart or table
    @observable showMode = 'chart';
    //  full:总打卡人数 valid有效打卡人数
    @observable tableSourceType = 'full';

    @observable originTableData = {
        FullClockDetail: [],
        FullStrTime: [],
        ValidClockDetail: [],
        ValidStrTime: []
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
            const requestFunc = showMode == 'chart' ? listClock : listClockDetail;
            const resData = await requestFunc(reqParam);
            view.tableLoading = false;
            if (showMode == 'chart') {
                view.chartData = resData.Data.RecordList || [];
            } else if (showMode == 'table') {
                const { FullClockDetail, FullStrTime, ValidClockDetail, ValidStrTime } = resData.Data;
                view.originTableData = {
                    FullClockDetail: FullClockDetail || [],
                    FullStrTime: FullStrTime || [],
                    ValidClockDetail: ValidClockDetail || [],
                    ValidStrTime: ValidStrTime || []
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
        window._czc.push(['_trackEvent', '打卡统计', { 1: '按日查询', 2: '按周查询', 3: '按月查询', 4: '按年查询' }[CycleTyp], '打卡统计_N非结算']);
    }

    @action
    changeShowMode = () => {
        const { showMode } = this.view;
        this.view.showMode = showMode == 'chart' ? 'table' : 'chart';
        this.startQuery();
    }

    @action
    changeDataSource = (type) => {
        this.view.tableSourceType = type;
        window._czc.push(['_trackEvent', '打卡统计', type === 'full' ? '点击总打卡人数按钮' : '点击有效打卡人数按钮', '打卡统计_N非结算']);
    }

    @action
    exportRec = async () => {
        //  2个sheet  总打卡人数，有效打卡人数
        const {
            originTableData: {
                FullClockDetail,
                FullStrTime,
                ValidClockDetail,
                ValidStrTime
            }
        } = this.view;

        const fullClockData = FullClockDetail.map(({ TrgtSpShortName, EntShortName, DataCountMap }) => {
            const colObj = FullStrTime.reduce((prev, curr) => {
                prev[curr] = DataCountMap[curr] || 0;
                return prev;
            }, {});
            return {
                '劳务': TrgtSpShortName,
                '企业': EntShortName,
                ...colObj
            };
        });

        const validClockData = ValidClockDetail.map(({ TrgtSpShortName, EntShortName, DataCountMap }) => {
            const colObj = ValidStrTime.reduce((prev, curr) => {
                prev[curr] = DataCountMap[curr] || 0;
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
            const ws1 = xlsx.utils.json_to_sheet(fullClockData);
            const ws2 = xlsx.utils.json_to_sheet(validClockData);
            const wb = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(wb, ws1, '总打卡人数');
            xlsx.utils.book_append_sheet(wb, ws2, '有效打卡人数');
            xlsx.writeFile(wb, '打卡统计.xlsx');
        } catch (err) {
            message.error(err.message);
            console.log(err);
        }
    }
}