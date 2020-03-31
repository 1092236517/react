import { observable, action } from "mobx";
import { message } from 'antd';
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { listLaborDepoMap, listBoss, editLaborDepoMap, addLaborDepoMap, deleteLaborDepoMap } from 'ADMIN_SERVICE/ZXX_BaseData';
import { safeMul, safeDiv } from 'ADMIN_UTILS/math';

export class View extends BaseView {
    @observable searchValue = {
        BossID: undefined,
        EnterID: undefined,
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

    @observable infoModal = {
        show: false,
        record: null
    }
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
            BossID: BossID || -9999,
            EnterID: EnterID || -9999,
            LaborID: LaborID || -9999,
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };

        try {
            view.tableInfo.loading = true;
            let resData = await listLaborDepoMap(reqParam);
            const { BossList = [], RecordCount } = resData.Data;
            let recordList = [];
            //  对原始数据拼装、分组
            // BossList.forEach((bossItem, bossIndex) => {
            //     const { LaborList = [] } = bossItem;
            //     LaborList.forEach((laborItem, laborIndex) => {
            //         const { EnterList = [] } = laborItem;
            //         EnterList.forEach((enterItem, enterIndex) => {
            //             let item = {
            //                 ...bossItem,
            //                 ...laborItem,
            //                 ...enterItem,
            //                 BossRowSpan: 0,
            //                 LaborRowSpan: 0
            //             };
            //
            //             delete item.LaborList;
            //             delete item.EnterList;
            //
            //             if (laborIndex == 0 && enterIndex == 0) {
            //                 item.BossRowSpan = LaborList.reduce((prev, curr) => (prev + curr['EnterList'].length), 0);
            //                 item.LaborRowSpan = EnterList.length;
            //             }
            //
            //             if (enterIndex == 0 && laborIndex != 0) {
            //                 item.LaborRowSpan = EnterList.length;
            //             }
            //
            //             recordList.push(item);
            //
            //         });
            //     });
            // });


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
                            recordList.push(item);

                        });
                    });
                });
            });

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
    addLaborDepoMap = (record) => {
        let reqParam = {
            ...record,
            DepositAmount: safeMul(record.DepositAmount, 100)
        };
        //  保存完毕后一定 要清空
        if (reqParam.RecordID) {
            //  修改
            editLaborDepoMap(reqParam).then((resData) => {
                message.success('修改成功！');
                this.startQuery();
                this.resetInfoModal();
            }).catch((err) => {
                message.error(err.message);
                console.log(err);
            });
        } else {
            //  新增
            delete reqParam['RecordID'];
            addLaborDepoMap(reqParam).then((resData) => {
                message.success('添加成功！');
                this.startQuery();
                this.resetInfoModal();
            }).catch((err) => {
                message.error(err.message);
                console.log(err);
            });
        }
    }

    @action
    editRecord = (record) => {
        this.view.infoModal = {
            show: true,
            record: {
                ...record,
                EnterID: record.EntID,
                DepositAmount: safeDiv(record.DepositAmount, 100)
            }
        };
    }

    @action
    deleteRecord = (record) => {
        let reqParam = {
            RecordID: record.RecordID
        };
        deleteLaborDepoMap(reqParam).then((resData) => {
            message.success('删除成功！');
            this.startQuery();
        }).catch((err) => {
            message.error(err.message);
            console.log(err);
        });
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
    resetInfoModal = () => {
        this.view.infoModal = {
            show: false,
            record: null
        };
    }

    @action
    setInfoModalShow = (s) => {
        if (!s) {
            this.resetInfoModal();
        } else {
            this.view.infoModal.show = s;
        }
    }
}
