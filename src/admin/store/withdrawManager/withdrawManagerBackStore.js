import { observable, action, toJS } from "mobx";
import { message, Modal } from 'antd';
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { getBankBackList, withDrawRePay, destroyBankBack, exportBankBackList } from 'ADMIN_SERVICE/ZXX_WithdrawMgr';


export class View extends BaseView {
    @observable searchValue = {
        BeginDate: undefined,
        EndDate: undefined,
        BatchID: '',
        RealName: '',
        IDCardNum: '',
        TradeType: -9999,
        ReApplyState: -9999
    }

    @observable attachInfo = {
        UnHandleCount: 0,
        SelectedAmount: 0
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
                BeginDate, EndDate, BatchID, RealName, IDCardNum, TradeType, ReApplyState
            },
            pagination: {
                current, pageSize
            }
        } = view;
        view.tableInfo.loading = true;

        let reqParam = {
            BeginDate: BeginDate ? BeginDate.format('YYYY-MM-DD') : '',
            EndDate: EndDate ? EndDate.format('YYYY-MM-DD') : '',
            IDCardNum,
            RealName: RealName.trim(),
            BatchID: BatchID ? BatchID * 1 : -9999,
            ReApplyState,
            TradeType,
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };

        try {
            let resData = await getBankBackList(reqParam);

            view.tableInfo = {
                dataList: resData.Data.RecordList || [],
                loading: false,
                total: resData.Data.RecordCount
            };
            view.attachInfo.UnHandleCount = resData.Data.UnHandleCount;
        } catch (err) {
            view.tableInfo.loading = false;
            message.error(err.message);
            console.log(err);
        }
    }

    //  设置分页
    @action
    setPagination = (current, pageSize) => {
        let view = this.view;
        view.pagination = {
            current,
            pageSize
        };
        view.attachInfo.SelectedAmount = 0;
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
    setSelectRowKeys = (selectedRowKeys, selectedRows = [{ Amount: 0 }]) => {
        this.view.tableInfo = {
            ...this.view.tableInfo,
            ...{
                selectedRowKeys: selectedRowKeys
            }
        };

        this.view.attachInfo.SelectedAmount = selectedRows.reduce((total, currentValue) => {
            return total + currentValue.Amount;
        }, 0);
    }

    @action
    withDrawRePay = async () => {
        const rows = this.view.tableInfo.selectedRowKeys || [];
        if (rows.length == 0) {
            message.info('请选择一条记录！');
            return;
        }

        let reqParam = {
            BankBackIDList: rows
        };

        try {
            let resData = await withDrawRePay(reqParam);
            message.success('申请重发成功！');
            this.startQuery();
            this.setSelectRowKeys([]);
        } catch (err) {
            message.error(err.message);
            console.log(err);
        }
    }

    @action
    destroyBankBack = async () => {
        const rows = this.view.tableInfo.selectedRowKeys || [];
        if (rows.length != 1) {
            message.info('请选择一条记录！');
            return;
        }

        Modal.confirm({
            title: '提示',
            content: '确认要作废吗？',
            onOk: async () => {
                let reqParam = {
                    BankBackIDList: rows
                };

                try {
                    let resData = await destroyBankBack(reqParam);
                    message.success('作废成功！');
                    this.startQuery();
                    this.setSelectRowKeys([]);
                } catch (err) {
                    message.error(err.message);
                    console.log(err);
                }
            }
        });
    }

    @action
    exportRecord = async () => {
        const view = this.view;
        const { BeginDate, EndDate, BatchID, RealName, IDCardNum, TradeType, ReApplyState } = view.searchValue;

        let reqParam = {
            BeginDate: BeginDate ? BeginDate.format('YYYY-MM-DD') : '',
            EndDate: EndDate ? EndDate.format('YYYY-MM-DD') : '',
            IDCardNum,
            RealName: RealName.trim(),
            BatchID: BatchID ? BatchID * 1 : -9999,
            ReApplyState,
            TradeType
        };

        try {
            let resData = await exportBankBackList(reqParam);
            window.open(resData.Data.FileUrl);
        } catch (err) {
            message.error(err.message);
            console.log(err);
        }
    }
}