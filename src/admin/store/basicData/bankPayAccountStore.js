import { observable, action } from "mobx";
import { message } from 'antd';
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { getBankPayAcct, updateBankPayAcct, addBankPayAcct, ableBankPayAcct } from 'ADMIN_SERVICE/ZXX_BaseData';


export class View extends BaseView {
    @observable searchValue = {
        BankCardNum: '',
        BankAccntName: ''
    }

    @observable pagination = {
        current: 1,
        pageSize: 10
    }

    @observable tableInfo = {
        dataList: [],
        loading: false,
        total: 0,
        selectedRowKeys: []
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
        //  保存完毕后一定 要清空
        if (record.PayAccntId) {
            //  修改
            updateBankPayAcct(record).then((resData) => {
                message.success('修改成功！');
                this.startQuery();
                this.resetInfoModal();
            }).catch((err) => {
                message.error(err.message);
                console.log(err);
            });
        } else {
            //  新增
            delete record['PayAccntId'];
            addBankPayAcct(record).then((resData) => {
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
    switchAccountSts = (isValid) => {
        const view = this.view;
        const { tableInfo: { selectedRowKeys = [] } } = view;
        if (selectedRowKeys.length == 0) {
            message.info('请选择一条记录操作！');
            return;
        }

        let reqParam = {
            IsValide: isValid ? 1 : 2,
            PayAccntIds: selectedRowKeys.slice()
        };
        window._czc.push(['_trackEvent', '银行付款账号管理', isValid ? '启用！' : '禁用', '银行付款账号管理_Y结算']);
        ableBankPayAcct(reqParam).then((resData) => {
            message.success(isValid ? '启用成功！' : '禁用成功！');
            this.startQuery();
        }).catch((err) => {
            message.error(err.message);
            console.log(err);
        });
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
                BankCardNum, BankAccntName
            },
            pagination: {
                current, pageSize
            }
        } = view;
        view.tableInfo.loading = true;

        let reqParam = {
            BankCardNum,
            BankAccntName,
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };

        try {
            let resData = await getBankPayAcct(reqParam);

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
    setSelectRowKeys = (selectedRowKeys) => {
        this.view.tableInfo = {
            ...this.view.tableInfo,
            ...{
                selectedRowKeys: selectedRowKeys
            }
        };
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