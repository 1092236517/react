import { BaseView, BaseViewStore } from 'ADMIN/store/BaseViewStore';
import { DeleteApply, QueryApply, submitAudit } from 'ADMIN_SERVICE/ZXX_Remit';
import { message, Modal } from 'antd';
import { action, observable } from 'mobx';

export class View extends BaseView {
    @observable searchValue = {
        AuthSts: -9999, // 审核状态
        BillBatchId: undefined, // 批次号
        BillBatchTyp: -9999, // 批次类型
        SettleBeginDt: undefined,
        SettleEndDt: undefined,
        BillSrce: -9999, // 账单来源
        EntId: undefined, // 企业ID
        SrceSpId: undefined, // 中介ID
        TrgtSpId: undefined, // 劳务ID
        AuthSubmitSts: -9999 // 提交授权
    };

    @observable pagination = {
        current: 1,
        pageSize: 10
    }

    @observable tableInfo = {
        dataList: [],
        loading: false,
        total: 0,
        selectedRowKeys: [],
        selectedRows: []
    }
}
export default class extends BaseViewStore {
    @action
    startQuery = async () => {
        let view = this.view;
        const {
            pagination: {
                current, pageSize
            },
            searchValue: {
                SettleBeginDt, SettleEndDt, BillBatchId, EntId, SrceSpId, TrgtSpId
            }
        } = view;

        let reqParam = {
            ...view.searchValue,
            EntId: EntId || -9999,
            SrceSpId: SrceSpId || -9999,
            TrgtSpId: TrgtSpId || -9999,
            BillBatchId: BillBatchId ? BillBatchId * 1 : -9999,
            SettleBeginDt: SettleBeginDt ? SettleBeginDt.format('YYYY-MM-DD') : "",
            SettleEndDt: SettleEndDt ? SettleEndDt.format('YYYY-MM-DD') : "",
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };
        try {
            view.tableInfo.loading = true;
            const res = await QueryApply(reqParam);
            const { RecordList, RecordCount } = res.Data;
            view.tableInfo = {
                dataList: RecordList,
                loading: false,
                total: RecordCount,
                selectedRowKeys: [],
                selectedRows: []
            };
        } catch (error) {
            view.tableInfo.loading = false;
            message.error(error.message);
            console.log(error);
        }
    }

    @action
    delApply = async (applyID) => {
        let view = this.view;
        Modal.confirm({
            title: '删除',
            content: '将会删除该条记录,确认继续？',
            onOk: async () => {
                window._czc.push(['_trackEvent', '发薪申请', '删除', '发薪申请_Y结算']);
                let reqParam = { ApplyId: applyID };
                try {
                    view.tableInfo.loading = true;
                    await DeleteApply(reqParam);
                    message.success("删除成功");
                    this.startQuery();
                } catch (error) {
                    view.tableInfo.loading = false;
                    message.error(error.message);
                    console.log(error);
                }
            },
            onCancel: () => { }
        });
    }

    @action
    submitBatch = () => {
        const rows = this.view.tableInfo.selectedRowKeys || [];
        if (rows.length == 0) {
            message.info('请选择一条记录！');
            return;
        }

        Modal.confirm({
            content: '确认提交授权？',
            onOk: () => {
                message.loading('正在提交授权......');
                let applyIndex = 0;
                const doSumbit = () => {
                    const batchID = rows[applyIndex];
                    if (!batchID) {
                        message.destroy();
                        this.startQuery();
                        return;
                    }
                    let reqParam = { RemittanceAppId: batchID };
                    submitAudit(reqParam).then(() => {
                        ++applyIndex;
                        doSumbit();
                    }).catch((err) => {
                        message.error(err.message);
                        console.log(err);
                        ++applyIndex;
                        doSumbit();
                    });
                };
                doSumbit();
            }
        });
    }

    @action
    setSelectRowKeys = (selectedRowKeys, selectedRows) => {
        this.view.tableInfo = {
            ...this.view.tableInfo,
            ...{
                selectedRowKeys,
                selectedRows
            }
        };
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
    handleFormValuesChange = (values) => {
        if (values.BillBatchTyp === 3) {
            values.SettleBeginDt = undefined;
            values.SettleEndDt = undefined;
        }
        this.view.searchValue = values;
    }

    @action
    resetForm = () => {
        this.view.resetProperty('searchValue');
    }
}
