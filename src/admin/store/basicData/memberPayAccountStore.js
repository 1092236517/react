import { observable, action } from "mobx";
import { message } from 'antd';
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { addMemberPayAcct, updateMemberPayAcct, getMemberPayAcct, expMemberPayAcct } from 'ADMIN_SERVICE/ZXX_BaseData';

export class View extends BaseView {
    @observable searchValue = {
        EntId: undefined,
        SpId: undefined,
        BankVirtualSubAccnt: ''
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

    @observable infoModal = {
        show: false,
        record: null
    }
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
    setInfoModalShow = (s) => {
        if (!s) {
            this.resetInfoModal();
        } else {
            this.view.infoModal.show = s;
        }
    }

    @action
    saveData = (record) => {
        let reqParam = {
            ...record,
            EntId: record.EntId.key,
            SpId: record.SpId.key
        };

        //  保存完毕后一定 要清空
        if (reqParam.PayAccntRouterId) {
            //  修改
            updateMemberPayAcct(reqParam).then((resData) => {
                message.success('修改成功！');
                this.startQuery();
                this.resetInfoModal();
            }).catch((err) => {
                message.error(err.message);
                console.log(err);
            });
        } else {
            //  新增
            delete reqParam['PayAccntRouterId'];
            addMemberPayAcct(reqParam).then((resData) => {
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
    editAccount = (record) => {
        this.view.infoModal = {
            show: true,
            record
        };
        window._czc.push(['_trackEvent', '会员打款虚拟子账户', '修改', '会员打款虚拟子账户_Y结算']);
    }

    @action
    handleFormValuesChange = (values) => {
        this.view.searchValue = values;
    }

    @action
    startQuery = async () => {
        const view = this.view;
        const {
            searchValue: {
                EntId, SpId
            },
            pagination: {
                current, pageSize
            }
        } = view;

        let reqParam = {
            ...view.searchValue,
            EntId: EntId || -9999,
            SpId: SpId || -9999,
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };

        try {
            view.tableInfo.loading = true;
            let resData = await getMemberPayAcct(reqParam);
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
    exportRec = async () => {
        window._czc.push(['_trackEvent', '会员打款虚拟子账户', '导出', '会员打款虚拟子账户_Y结算']);
        const view = this.view;
        const { searchValue: { EntId, SpId } } = view;

        let reqParam = {
            ...view.searchValue,
            EntId: EntId || -9999,
            SpId: SpId || -9999
        };

        try {
            let resData = await expMemberPayAcct(reqParam);
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
    resetForm = () => {
        this.view.resetProperty('searchValue');
    }
}