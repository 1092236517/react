import { BaseView, BaseViewStore } from 'ADMIN/store/BaseViewStore';
import { Select, Audit, destroyPayRoll } from 'ADMIN_SERVICE/ZXX_MonthBill';
import { message, Modal } from 'antd';
import { action, observable } from 'mobx';

export class View extends BaseView {
    @observable searchValue = {
        RealName: "",
        AuditSts: -9999,
        IdCardNum: '',
        WorkCardNo: '',
        MonthStart: undefined,
        MonthEnd: undefined,
        TrgtSpId: undefined,
        EntId: undefined,
        IsValid: -9999,
        MonthBillState: 1
    };

    @observable RecordList = [];
    @observable pagination = {
        current: 1,
        pageSize: 10
    }

    @observable totalNum = 0;
    @observable selectedRowKeys = [];
    @observable FormListStatus = 'close';

    @observable DetailsVisible = false;
    @observable modalLoading = false;
}
export default class extends BaseViewStore {
    // 工资单查询
    @action
    selectSalary = async () => {
        let view = this.view;
        view.RecordList = [];
        view.FormListStatus = 'pending';
        const { current, pageSize } = view.pagination;
        const { MonthStart, MonthEnd, TrgtSpId, EntId, AuditSts, WorkCardNo, IdCardNum, RealName } = view.searchValue;
        let query = {
            ...view.searchValue,
            TrgtSpId: TrgtSpId || -9999,
            EntId: EntId || -9999,
            MonthStart: MonthStart ? MonthStart.format('YYYY-MM') : "",
            MonthEnd: MonthEnd ? MonthEnd.format('YYYY-MM') : "",
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };
        try {
            let res = await Select(query);
            let Data = res.Data;
            view.FormListStatus = 'done';
            view.RecordList = Data.RecordList || [];
            view.totalNum = Data.RecordCount;
            view.selectedRowKeys = [];
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
        this.selectSalary();
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

    // 确认审核
    @action
    Audit = async (AuditSts, AuditRemark) => {
        let view = this.view;
        view.FormListStatus = 'padding';
        let PayrollIds = view.selectedRowKeys || [];
        let query = {
            AuditSts: AuditSts,
            PayrollIds: PayrollIds.slice()
        };
        if (AuditRemark) {
            query.AuditRemark = AuditRemark;
        }
        try {
            view.FormListStatus = 'done';
            let res = await Audit(query);
            let Data = res.Data;

            message.success("审核成功");
            this.selectSalary();
            view.selectedRowKeys = [];
            return Data;
        } catch (error) {
            view.FormListStatus = 'error';
            message.error(error.message);
            console.log(error);
        }
    }

    // 判断时否有选中的记录
    line = (AuditSts, AuditRemark) => {
        if (this.view.selectedRowKeys.length === 0) {
            message.warn('请选择要审核的记录');
        } else {
            if (AuditSts === 3) {
                this.Audit(AuditSts, AuditRemark);
            } else {
                Modal.confirm({
                    title: '你确定要审核所选择的数据吗?',
                    okText: '确定',
                    cancelText: '取消',
                    onOk: () => {
                        this.Audit(AuditSts, AuditRemark);
                    }
                });
            }
        }
    }

    // 设置弹窗的显示和隐藏
    @action
    setVisible = (flag) => {
        this.view.modalLoading = true;
        this.view.DetailsVisible = flag;
        this.view.modalLoading = false;
    }

    @action
    handleFormValuesChange = (values) => {
        this.view.searchValue = values;
    }

    @action
    handleFormReset = () => {
        this.view.resetProperty('searchValue');
    }

    @action
    destroyPayRoll = () => {
        const { selectedRowKeys } = this.view;
        if ((selectedRowKeys || []).length === 0) {
            message.info('请选择要操作的记录！');
            return;
        }

        Modal.confirm({
            title: '信息',
            content: '确认要作废选中记录吗？',
            onOk: async () => {
                try {
                    let reqParam = {
                        PayrollIds: selectedRowKeys.slice()
                    };
                    await destroyPayRoll(reqParam);
                    message.success('作废成功！');
                    this.selectSalary();
                } catch (err) {
                    message.error(err.message);
                    console.log(err);
                }
            }
        });
    }
}