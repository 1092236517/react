import { observable, action } from "mobx";
import { message } from 'antd';
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { getQuitSalaryAnalysis, exportProfitDetail } from 'ADMIN_SERVICE/ZXX_BaseData';

export class View extends BaseView {
    @observable searchValue = {
        EntId: '',
        EntryDtEnd: null,
        EntryDtStart: null,
        IntvDtStart: null,
        IntvDtEnd: null,
        TrgtSpId: ''
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
                EntryDtEnd, EntryDtStart, IntvDtEnd, IntvDtStart, EntId, TrgtSpId
            },
            pagination: {
                current, pageSize
            }
        } = view;
        view.tableInfo.loading = true;
        let reqParam = {
            ...view.searchValue,
            EntryDtEnd: EntryDtEnd ? EntryDtEnd.format('YYYY-MM-DD') : '',
            EntryDtStart: EntryDtStart ? EntryDtStart.format('YYYY-MM-DD') : '',
            IntvDtEnd: IntvDtEnd ? IntvDtEnd.format('YYYY-MM-DD') : '',
            IntvDtStart: IntvDtStart ? IntvDtStart.format('YYYY-MM-DD') : '',
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize,
            TrgtSpId: TrgtSpId ? TrgtSpId : -9999,
            EntId: EntId ? EntId : -9999
        };
        console.log(reqParam);
        try {
            let resData = await getQuitSalaryAnalysis(reqParam);
            // let resData = {
            //     'Data': {}
            // };
            // resData.Data = {
            //     RecordCount: 19, RecordList: [{
            //         TrgtSpShortName1: 1,
            //         EntShortName2: 2,
            //         EntShortName3: '合计X',
            //         EntShortName4: '已发周薪',
            //         EntShortName5: '剩余月薪',
            //         EntShortName6: '返费',
            //         EntShortName7: '合计支出Y',
            //         EntShortName8: '盈利(X-Y)/2',
            //         EntShortName9: '中介费Z',
            //         EntShortName11: '入职人数',
            //         EntShortName12: '在职天数',
            //         EntShortName13: '每人每天盈利',
            //         EntShortName14: '每人每天Z',
            //         EntShortName15: '差异',
            //         EntShortName16: '盈利(X-Y)/2',
            //         EntShortName17: '中介费Z',
            //         QuitNumber: 3234,
            //         EntryNumber: 455,
            //         PersonQuitProfit: 2343568,
            //         QuitNumberPercent: 3
            //     }]
            // };
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
    exportRecord = async () => {
        const view = this.view;
        const {
            searchValue: {
                EntryDtEnd, EntryDtStart, IntvDtEnd, IntvDtStart
            },
            pagination: {
                current, pageSize
            }
        } = view;
        let reqParam = {
            ...view.searchValue,
            EntryDtEnd: EntryDtEnd ? EntryDtEnd.format('YYYY-MM-DD') : '',
            EntryDtStart: EntryDtStart ? EntryDtStart.format('YYYY-MM-DD') : '',
            IntvDtEnd: IntvDtEnd ? IntvDtEnd.format('YYYY-MM-DD') : '',
            IntvDtStart: IntvDtStart ? IntvDtStart.format('YYYY-MM-DD') : '',
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };

        try {
            let resData = await exportProfitDetail(reqParam);
            window.open(resData.Data.FileUrl);
        } catch (err) {
            message.error(err.message);
            console.log(err);
        }
    }

}