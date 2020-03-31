import { observable, action } from "mobx";
import { message } from 'antd';
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { listBoss } from 'ADMIN_SERVICE/ZXX_BaseData';
import { listLaborDepo, expLaborDepo, refreshLaborDepo } from 'ADMIN_SERVICE/ZXX_Busi_Manage';

export class View extends BaseView {
    @observable searchValue = {
        BossID: undefined,
        EnterID: undefined,
        IsDebt: -9999,
        IsPre: -9999,
        LaborID: undefined
    }

    @observable bossList = [];

    @observable pagination = {
        current: 1,
        pageSize: 100
    }

    @observable tableInfo = {
        dataList: [],
        loading: false,
        total: 0
    };

    @observable attachInfo = {

    }
     BossListData = [];
}

export default class extends BaseViewStore {
    @action
    startQuery = async () => {
        const view = this.view;
        const {
            searchValue: { BossID, EnterID, LaborID },
            pagination: { current, pageSize }
        } = view;

        let reqParam = {
            ...view.searchValue,
            BossID: BossID || -9999,
            EnterID: EnterID || -9999,
            LaborID: LaborID || -9999,
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };

        try {
            view.tableInfo.loading = true;
            let resData = await listLaborDepo(reqParam);
            const { BossList = [], RecordCount, DebtBossNum, DepositBalance, PreDeposit, TotalDeposit } = resData.Data;
            view.BossListData = BossList;
            view.attachInfo = {
                DebtBossNum,
                DepositBalance,
                PreDeposit,
                TotalDeposit
            };
            let recordList = [];
            //  对原始数据拼装、分组
            BossList.forEach((bossItem, bossIndex) => {
                const { LaborList = [] } = bossItem;
                LaborList.forEach((laborItem, laborIndex) => {
                    const { EnterList = [] } = laborItem;
                    EnterList.forEach((enterItem, enterIndex) => {
                        const { SettlementList = [] } = enterItem;
                        SettlementList.forEach((settleItem, settleIndex) => {
                            let item = {
                                ...bossItem,
                                ...laborItem,
                                ...enterItem,
                                ...settleItem,
                                BossRowSpan: 0,
                                LaborRowSpan: 0,
                                EntRowSpan: 0
                            };

                            delete item.LaborList;
                            delete item.EnterList;
                            delete item.SettlementList;

                            if (laborIndex == 0 && enterIndex == 0 && settleIndex == 0) {
                                item.BossRowSpan = LaborList.reduce((total, labor) => labor.EnterList.reduce((entTotal, ent) => entTotal + ent.SettlementList.length, 0) + total, 0);
                            }
                            if (enterIndex == 0 && settleIndex == 0) {
                                item.LaborRowSpan = EnterList.reduce((entTotal, ent) => entTotal + ent.SettlementList.length, 0);
                            }
                            if (settleIndex == 0) {
                                item.EntRowSpan = SettlementList.length;
                            }
                            console.log('======' + item);
                            recordList.push(item);

                        });


                    });
                });
            });
            console.log('======recordList' + recordList);
            view.tableInfo = {
                dataList: recordList,
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
    exportRecord = async () => {
        const view = this.view;
        const {
            searchValue: { BossID, EnterID, LaborID }
        } = view;

        let reqParam = {
            ...view.searchValue,
            BossID: BossID || -9999,
            EnterID: EnterID || -9999,
            LaborID: LaborID || -9999
        };

        try {
            view.tableInfo.loading = true;
            let resData = await expLaborDepo(reqParam);
            view.tableInfo.loading = false;
            const { FileUrl } = resData.Data;
            window.open(FileUrl);
        } catch (err) {
            view.tableInfo.loading = false;
            message.error(err.message);
            console.log(err);
        }
    }


    @action
    handleFormValuesChange = (values) => {
        this.view.searchValue = { ...values };
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
    getBossList = async () => {
        try {
            let resData = await listBoss();
            this.view.bossList = resData.Data.RecordList;
        } catch (err) {
            message.error(err.message);
            console.log(err);
        }
    }

    @action
    refresh = async () => {
        try {
            await refreshLaborDepo();
            message.success('刷新成功！');
        } catch (err) {
            message.error(err.message);
            console.log(err);
        }
    }
}