import { observable, action } from "mobx";
import { message } from 'antd';
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { listRiskFund, expRiskFund } from 'ADMIN_SERVICE/ZXX_RiskFund';

export class View extends BaseView {
    @observable searchValue = {
        TrgtSpId: undefined
    }

    @observable pagination = {
        current: 1,
        pageSize: 100
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
    startQuery = async (extraParams) => {
        const view = this.view;
        const {
            pagination: {
                current, pageSize
            }
        } = view;

        let reqParam = {
            ...view.searchValue,
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };

        try {
            view.tableInfo.loading = true;
            let resData = await listRiskFund(reqParam);
            const { Data: { RecordList, RecordCount } } = resData;
            let recordShow = [];

            (RecordList || []).forEach((labor, laborIndex) => {
                const { EntList } = labor;
                (EntList || []).forEach((ent, entIndex) => {
                    const { EntId, EntShortName, SettlementList } = ent;
                    SettlementList.forEach((settle, settleIndex) => {
                        let item = {
                            ...labor,
                            ...ent,
                            ...settle,
                            LaborRowSpan: 0,
                            EntRowSpan: 0
                        };

                        delete item.EntList;
                        delete item.SettlementList;

                        if (entIndex == 0 && settleIndex == 0) {
                            item.LaborRowSpan = (EntList || []).reduce((prev, curr) => (prev + curr.SettlementList.length), 0);
                            item.EntRowSpan = SettlementList.length;
                        }

                        if (settleIndex == 0 && entIndex != 0) {
                            item.EntRowSpan = SettlementList.length;
                        }

                        recordShow.push(item);
                    });
                });
            });

            console.log('recordShow', recordShow);

            view.tableInfo = {
                dataList: recordShow,
                loading: false,
                total: RecordCount
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
    exportRecord = async () => {
        const view = this.view;
        let reqParam = {
            ...view.searchValue
        };

        try {
            let resData = await expRiskFund(reqParam);
            window.open(resData.Data.FileUrl);
        } catch (err) {
            message.error(err.message);
            console.log(err);
        }
    }

    @action
    handleFormReset = () => {
        this.view.resetProperty('searchValue');
    }
}