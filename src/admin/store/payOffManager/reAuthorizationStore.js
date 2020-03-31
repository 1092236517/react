import { BaseView, BaseViewStore } from 'ADMIN/store/BaseViewStore';
import { QueryReAudit, ReAudit } from 'ADMIN_SERVICE/ZXX_Remit';
import { message, Modal } from 'antd';
import { action, observable } from 'mobx';

export class View extends BaseView {
    @observable searchValue = { // 查询重发授权申请
        AuditSts: -9999, // 审核状态
        BillBatchId: null, // 批次号
        IdCardNum: "", // 身份证号
        BankAccntName: "", // 姓名
        RemittanceTyp: -9999, // 交易类型
        TransferBeginTm: null,
        TransferEndTm: null,
        BillSrce: -9999 // 来源
    };

    @observable RecordList = [];
    @observable pagination = {
        current: 1,
        pageSize: 10
    }
    @observable totalNum = 0;
    @observable selectedRowKeys = [];
    @observable FormListStatus = 'close';
}
export default class extends BaseViewStore {
    // 获取重发授权列表
    @action
    queryReAudit = async () => {
        let view = this.view;
        view.RecordList = [];
        view.FormListStatus = 'pending';
        const { current, pageSize } = view.pagination;
        const { TransferBeginTm, TransferEndTm, BillBatchId, AuditSts, IdCardNum, BankAccntName, RemittanceTyp, BillSrce } = view.searchValue;
        let query = {
            AuditSts: AuditSts ? AuditSts * 1 : -9999,
            RemittanceTyp: RemittanceTyp ? RemittanceTyp * 1 : -9999,
            BillSrce: BillSrce ? BillSrce * 1 : -9999,
            BillBatchId: BillBatchId ? BillBatchId * 1 : -9999,
            IdCardNum: IdCardNum.length > 0 ? IdCardNum : "",
            BankAccntName: BankAccntName.length > 0 ? BankAccntName.trim() : "",
            TransferBeginTm: TransferBeginTm ? TransferBeginTm.format('YYYY-MM-DD') : "",
            TransferEndTm: TransferEndTm ? TransferEndTm.format('YYYY-MM-DD') : "",
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };

        try {
            let res = await QueryReAudit(query);
            let Data = res.Data;
            view.FormListStatus = 'done';
            view.RecordList = Data.RecordList || [];
            view.totalNum = Data.RecordCount;
            view.selectedRowKeys = [];
            return Data;
        } catch (error) {
            view.FormListStatus = 'error';
            message.error(error.message);
            console.log(error);
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
        this.queryReAudit();
    }

    @action
    resetPageCurrent = () => {
        let view = this.view;
        view.pagination = {
            ...view.pagination,
            current: 1
        };
    }

    // 表格选中的行
    @action
    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.view.selectedRowKeys = selectedRowKeys;
    }

    // 确认授权
    @action
    reAudit = async (id) => {
        let view = this.view;
        view.FormListStatus = 'pending';
        let query = { ReApplyIDs: typeof id == 'number' ? [id] : id.slice() };
        try {
            view.FormListStatus = 'done';
            let res = await ReAudit(query);
            let Data = res.Data;
            message.success("授权成功");
            this.queryReAudit();
            view.selectedRowKeys = [];
            return Data;
        } catch (error) {
            view.FormListStatus = 'error';
            message.error(error.message);
            console.log(error);
        }
    }

    // 判断时否有选中的记录
    line = () => {
        if (this.view.selectedRowKeys.length === 0) {
            message.warn('请选择要授权的记录');
        } else {
            Modal.confirm({
                title: '您确定要授权选择的所有申请吗？',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    this.reAudit(this.view.selectedRowKeys);
                }
            });
        }
    }

    @action
    handleFormValuesChange = (values) => {        
        this.view.searchValue = values;
    }

    @action
    handleFormReset = () => {
        this.view.resetProperty('searchValue');
    }

}