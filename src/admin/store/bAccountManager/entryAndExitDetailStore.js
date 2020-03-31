import { observable, action } from "mobx";
import { message } from 'antd';
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { getentryAndExitDetailList, expDataList } from 'ADMIN_SERVICE/ZXX_BAccount';

export class View extends BaseView {
    @observable searchValue = {
        EntId: undefined,
        TrgtSpId: undefined,
        BankVirtualSubAccnt: '',
        OprTyp: undefined,
        SplitTyp: '',
        ApplyTmBegin: undefined,
        ApplyTmEnd: undefined,
        TransferTmBegin: undefined,
        TransferTmEnd: undefined,
        RelatedMoBegin: undefined,
        RelatedMoEnd: undefined,
        IsZSkip: '',
        RecordIndex: '',
        RecordSize: '',
        DireactType: ''
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
    resetInfoModal = () => {
        this.view.infoModal = {
            show: false,
            record: null
        };
    }


    @action
    handleFormValuesChange = (values) => {
        console.log(values);
        this.view.searchValue = values;
    }
    @action
    startQuery = async () => {
        const view = this.view;
        const {
            searchValue: {
                EntId, TrgtSpId, OprTyp, SplitTyp, ApplyTmBegin, ApplyTmEnd, TransferTmBegin, TransferTmEnd, RelatedMoBegin, RelatedMoEnd, IsZSkip, DireactType
            },
            pagination: {
                current, pageSize
            }
        } = view;
        let reqParam = {
            ...view.searchValue,
            EntId: EntId || -9999,
            TrgtSpId: TrgtSpId || -9999,
            OprTyp: OprTyp || -9999,
            SplitTyp: SplitTyp || -9999,
            ApplyTmBegin: ApplyTmBegin ? ApplyTmBegin.format('YYYY-MM-DD') : "",
            ApplyTmEnd: ApplyTmEnd ? ApplyTmEnd.format('YYYY-MM-DD') : "",
            TransferTmBegin: TransferTmBegin ? TransferTmBegin.format('YYYY-MM-DD') : "",
            TransferTmEnd: TransferTmEnd ? TransferTmEnd.format('YYYY-MM-DD') : "",
            RelatedMoBegin: RelatedMoBegin ? RelatedMoBegin.format('YYYY-MM-01') : "",
            RelatedMoEnd: RelatedMoEnd ? RelatedMoEnd.format('YYYY-MM-01') : "",
            IsZSkip: IsZSkip || 1,
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };
        delete reqParam.DireactType;
        if (DireactType === 'zreport') {
            // 当前页面搜索非其他页面跳转过来
            reqParam.IsZSkip = IsZSkip || 2;
            reqParam.SplitTyp = SplitTyp || 1;
        } else if (DireactType === 'zxreport') {
            reqParam.IsZSkip = IsZSkip || 1;
            reqParam.SplitTyp = SplitTyp || 3;
        } else if (DireactType === '') {
            reqParam.IsZSkip = IsZSkip || 1;
        }

        try {
            view.tableInfo.loading = true;
            let resData = await getentryAndExitDetailList(reqParam);
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
    exportRecord = async () => {
        const view = this.view;
        const {
            searchValue: {
                EntId, TrgtSpId, OprTyp, SplitTyp, ApplyTmBegin, ApplyTmEnd, TransferTmBegin, TransferTmEnd, RelatedMoBegin, RelatedMoEnd, IsZSkip, DireactType
            },
            pagination: {
                current, pageSize
            }
        } = view;

        let reqParam = {
            ...view.searchValue,
            EntId: EntId || -9999,
            TrgtSpId: TrgtSpId || -9999,
            OprTyp: OprTyp || -9999,
            SplitTyp: SplitTyp || -9999,
            ApplyTmBegin: ApplyTmBegin ? ApplyTmBegin.format('YYYY-MM-DD') : "",
            ApplyTmEnd: ApplyTmEnd ? ApplyTmEnd.format('YYYY-MM-DD') : "",
            TransferTmBegin: TransferTmBegin ? TransferTmBegin.format('YYYY-MM-DD') : "",
            TransferTmEnd: TransferTmEnd ? TransferTmEnd.format('YYYY-MM-DD') : "",
            RelatedMoBegin: RelatedMoBegin ? RelatedMoBegin.format('YYYY-MM-01') : "",
            RelatedMoEnd: RelatedMoEnd ? RelatedMoEnd.format('YYYY-MM-01') : "",
            IsZSkip: IsZSkip || 1,
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };
        delete reqParam.DireactType;
        if (DireactType === 'zreport') {
            // 当前页面搜索从Z盈利表表跳转过来
            reqParam.IsZSkip = IsZSkip || 2;
        } else if (DireactType === 'zxreport') {
            // 当前页面搜索从ZX盈利表表跳转过来
            reqParam.IsZSkip = IsZSkip || 1;
        } else if (DireactType === '') {
            reqParam.IsZSkip = IsZSkip || 1;
        }
        try {
            let resData = await expDataList(reqParam);
            window.open(resData.Data.FileUrl);
        } catch (err) {
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
    handleFormReset = () => {
        this.view.resetProperty('searchValue');
    }
}