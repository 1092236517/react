import { observable, action } from "mobx";
import { message } from 'antd';
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { addAgentPayAcct, updateAgentPayAcct, getAgentPayAcct } from 'ADMIN_SERVICE/ZXX_BaseData';

export class View extends BaseView {
    @observable searchValue = {
        SpId: undefined
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
            SpId: record.SpId.key
        };
        //  保存完毕后一定 要清空
        if (reqParam.PayAccntRouterId) {
            //  修改
            updateAgentPayAcct(reqParam).then((resData) => {
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
            addAgentPayAcct(reqParam).then((resData) => {
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
                SpId
            },
            pagination: {
                current, pageSize
            }
        } = view;
        view.tableInfo.loading = true;

        let reqParam = {
            SpId: SpId || -9999,
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };

        try {
            let resData = await getAgentPayAcct(reqParam);

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
}