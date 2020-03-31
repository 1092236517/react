import { observable, action } from "mobx";
import { message, Modal } from 'antd';
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { getWithdrawDetailList, withDrawPay, exportWithdrawDetailList, getWithdrawExportRes } from 'ADMIN_SERVICE/ZXX_WithdrawMgr';
import { convertCentToThousandth } from 'web-react-base-utils';

export class View extends BaseView {
    @observable searchValue = {
        BeginDate: undefined,
        EndDate: undefined,
        StartMonth: undefined,
        EndMonth: undefined,
        BatchID: '',
        RealName: '',
        IDCardNum: '',
        TradeType: -9999,
        BatchSrc: -9999,
        AuditState: -9999,
        WithdrawState: -9999,
        ToState: -9999,
        EntId: undefined,
        TrgtSpId: undefined,
        WithdrawTimeS: undefined,
        WithdrawTimeE: undefined,
        SettlementTyp: -9999,
        EmploymentTyp: -9999
    }

    @observable pagination = {
        current: 1,
        pageSize: 10
    }

    @observable attachInfo = {
        UnAuditAmount: 0,
        UnAuditCount: 0,
        WaitWithdrawAmount: 0,
        WaitWithdrawCount: 0,
        SelectedAmount: 0
    }

    @observable tableInfo = {
        dataList: [],
        loading: false,
        selectedRowKeys: [],
        total: 0
    };

    @observable schedulerID = '';
}

export default class extends BaseViewStore {
    @action
    handleFormValuesChange = (values) => {
        if (values.TradeType === 7 || values.TradeType === 8) {
            values.BeginDate = undefined;
            values.EndDate = undefined;
        }
        this.view.searchValue = values;
    }

    @action
    startQuery = async (extraParams) => {
        const view = this.view;
        if (extraParams) {
            view.searchValue = { ...view.searchValue, ...extraParams };
        }
        const {
            searchValue: {
                WithdrawTimeS, WithdrawTimeE, EntId, TrgtSpId, BeginDate, EndDate, StartMonth, EndMonth, BatchID, RealName
            },
            pagination: {
                current, pageSize
            }
        } = view;

        view.tableInfo.loading = true;

        let reqParam = {
            ...view.searchValue,
            BeginDate: BeginDate ? BeginDate.format('YYYY-MM-DD') : '',
            EndDate: EndDate ? EndDate.format('YYYY-MM-DD') : '',
            WithdrawTimeS: WithdrawTimeS ? WithdrawTimeS.format('YYYY-MM-DD') : '',
            WithdrawTimeE: WithdrawTimeE ? WithdrawTimeE.format('YYYY-MM-DD') : '',
            EntId: EntId || -9999,
            TrgtSpId: TrgtSpId || -9999,
            StartMonth: StartMonth ? (StartMonth.format('YYYY-MM') + '-01') : '',
            EndMonth: EndMonth ? (EndMonth.format('YYYY-MM') + '-01') : '',
            RealName: RealName.trim(),
            BatchID: BatchID ? BatchID * 1 : -9999,
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };

        try {
            let resData = await getWithdrawDetailList(reqParam);
            view.tableInfo = {
                dataList: resData.Data.RecordList || [],
                loading: false,
                total: resData.Data.RecordCount
            };


            const { UnAuditAmount, UnAuditCount, WaitWithdrawAmount, WaitWithdrawCount } = resData.Data;
            view.attachInfo = {
                ...view.attachInfo,
                UnAuditAmount,
                UnAuditCount,
                WaitWithdrawAmount,
                WaitWithdrawCount
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
    withDrawPay = async () => {
        const view = this.view;
        const rows = view.tableInfo.selectedRowKeys || [];
        if (rows.length == 0) {
            message.info('请选择一条记录！');
            return;
        }

        Modal.confirm({
            title: '信息',
            content: `本次即将打出${convertCentToThousandth(view.attachInfo.SelectedAmount)}元，是否确定打款？`,
            onOk: () => {
                const rows = view.tableInfo.selectedRowKeys || [];
                let reqParam = {
                    WithdrawDetailIDList: rows
                };

                withDrawPay(reqParam).then((resData) => {
                    this.startQuery();
                    message.success('处理成功！', 3);
                }).catch((err) => {
                    message.error(err.message);
                    console.log(err);
                });
            }
        });
    }

    @action
    exportRecord = async () => {
        const view = this.view;
        const {
            WithdrawTimeS, WithdrawTimeE, EntId, TrgtSpId, BeginDate, EndDate, StartMonth, EndMonth, BatchID, RealName
        } = view.searchValue;

        let reqParam = {
            ...view.searchValue,
            BeginDate: BeginDate ? BeginDate.format('YYYY-MM-DD') : '',
            EndDate: EndDate ? EndDate.format('YYYY-MM-DD') : '',
            WithdrawTimeS: WithdrawTimeS ? WithdrawTimeS.format('YYYY-MM-DD') : '',
            WithdrawTimeE: WithdrawTimeE ? WithdrawTimeE.format('YYYY-MM-DD') : '',
            EntId: EntId || -9999,
            TrgtSpId: TrgtSpId || -9999,
            StartMonth: StartMonth ? (StartMonth.format('YYYY-MM') + '-01') : '',
            EndMonth: EndMonth ? (EndMonth.format('YYYY-MM') + '-01') : '',
            RealName: RealName.trim(),
            BatchID: BatchID ? BatchID * 1 : -9999
        };

        try {
            let resData = await exportWithdrawDetailList(reqParam);
            const { Data: { BizID } } = resData;
            this.getWithdrawExportRes(BizID);
            view.schedulerID = setInterval(() => {
                this.getWithdrawExportRes(BizID);
            }, 2000);
        } catch (err) {
            message.error(err.message);
            console.log(err);
        }
    }

    @action
    getWithdrawExportRes = async (BizID) => {
        const view = this.view;
        let reqParam = { BizID };
        try {
            let resData = await getWithdrawExportRes(reqParam);
            const { State, FileUrl, TaskCode, TaskDesc } = resData.Data;

            if (State == 0) {
                //    未完成
                message.loading('正在导出记录请稍候！');
            } else {
                //  已完成
                window.clearInterval(view.schedulerID);
                view.schedulerID = '';
                if (TaskCode == 0) {
                    window.open(FileUrl);
                } else {
                    message.error(TaskDesc);
                }
            }
        } catch (err) {
            window.clearInterval(view.schedulerID);
            view.schedulerID = '';
            message.error(err.message);
            console.log(err);
        }
    }

    @action
    handleFormReset = () => {
        this.view.resetProperty('searchValue');
    }
}