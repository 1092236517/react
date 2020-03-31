import { observable, action } from "mobx";
import { message } from 'antd';
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { getProfitDetail, exportProfitDetail } from 'ADMIN_SERVICE/ZXX_BaseData';
import { getResAsync } from 'ADMIN_UTILS';
import {
    getResByBizID
} from 'ADMIN_SERVICE/ZXX_Busi_Manage';
export class View extends BaseView {
    @observable searchValue = {
        EntId: '',
        EntryDtEnd: null,
        EntryDtStart: null,
        IntvDtStart: null,
        IntvDtEnd: null,
        OrderDtEnd: null,
        OrderDtStart: null,
        SettlementTyp: '',
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
    @observable synchVisible = false
    @observable synchVisibleValue = ''
    @observable exportButContro = false
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
                EntryDtEnd, EntryDtStart, IntvDtEnd, IntvDtStart, OrderDtEnd, OrderDtStart, EntId, TrgtSpId, SettlementTyp
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
            OrderDtEnd: OrderDtEnd ? OrderDtEnd.format('YYYY-MM-DD') : '',
            OrderDtStart: OrderDtStart ? OrderDtStart.format('YYYY-MM-DD') : '',
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize,
            TrgtSpId: TrgtSpId ? TrgtSpId : -9999,
            EntId: EntId ? EntId : -9999,
            SettlementTyp: SettlementTyp ? SettlementTyp : -9999
        };
        console.log(reqParam);
        try {
            let resData = await getProfitDetail(reqParam);
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
            //         XMoney: 3234,
            //         YMoney: 455,
            //         EntryDt: '2019-07-31 14:55:47',
            //         TotReturnFee: 2343568,
            //         WorkDays: 3
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
                EntryDtEnd, EntryDtStart, IntvDtEnd, IntvDtStart, OrderDtEnd, OrderDtStart, TrgtSpId, EntId, SettlementTyp
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
            OrderDtEnd: OrderDtEnd ? OrderDtEnd.format('YYYY-MM-DD') : '',
            OrderDtStart: OrderDtStart ? OrderDtStart.format('YYYY-MM-DD') : '',
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize,
            TrgtSpId: TrgtSpId ? TrgtSpId : -9999,
            EntId: EntId ? EntId : -9999,
            SettlementTyp: SettlementTyp ? SettlementTyp : -9999
        };

        try {
            this.view.exportButContro = true;
            let resData = await exportProfitDetail(reqParam);
            const { BizID } = resData.Data;
            resData = await getResAsync(getResByBizID, { BizID });
            const { FileUrl } = resData;
            this.view.exportButContro = false;
            window.open(FileUrl);
        } catch (err) {
            message.error(err.message);
            console.log(err);
        }
    }
    @action
    setSynchVisible = (visible) => {
        this.view.synchVisible = visible;
    }
    @action
    setSynchVisibleValue = (value) => {
        this.view.synchVisibleValue = value;
    }
}