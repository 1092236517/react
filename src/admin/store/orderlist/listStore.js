import { observable, action, toJS } from "mobx";
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { message, Modal } from 'antd';
import moment from 'moment';
import { listInvalid, saveSynch, importList, bind, getList, listRecovery } from 'ADMIN_SERVICE/ZXX_NameManager';
import { getBindOrderList, SynchronousOrderList } from 'ADMIN_SERVICE/ZXX_OrderManager';

export class View extends BaseView {
    @observable searchValue = {
        RealEntId: undefined,
        IdCardNum: '',
        IntvSts: -9999,
        IsBindOrder: -9999,
        IsValid: -9999,
        WorkSts: -9999,
        Mobile: '',
        Realname: '',
        SrceSpId: undefined,
        TrgtSpId: undefined,
        StartDate: moment().subtract(7, 'days'),
        EndDate: moment(),
        EntryDtBegin: undefined,
        EntryDtEnd: undefined,
        LeaveDtBegin: undefined,
        LeaveDtEnd: undefined,
        EmploymentType: -9999
    };

    @observable selectedRowKeys = [];
    @observable dataSource = [];
    @observable selectedRows = [];
    @observable page = {
        RecordIndex: 1,
        RecordSize: 10
    };
    @observable RecordCount = 0;
    // 订单列表
    @observable orderList = [];
    @observable loading = false;
    @observable synchVisible = false; // 同步名单
    @observable synchOrderVisible = false; // 同步订单
    @observable bindVisible = false;
    @observable listInvalidVisible = false;
    @observable listRecoveryVisible = false;
    @observable importVisible = false;
    @observable orderDetailsVisible = false;
    @observable orderRemarkVisible = false;
    @observable modalLoading = false;
    @observable listIsValid = 1;
}

export default class extends BaseViewStore {
    @action
    getList = async (param) => {
        this.view.loading = true;
        param ? (this.view.page = param) : (this.view.page = { RecordIndex: 1, RecordSize: this.view.page.RecordSize });
        let page = { RecordIndex: (this.view.page.RecordIndex - 1) * this.view.page.RecordSize, RecordSize: this.view.page.RecordSize };
        const searchValue = { ...{}, ...this.view.searchValue };
        for (let key in searchValue) {
            if (key === 'StartDate' || key === 'EndDate') {
                searchValue[key] && (searchValue[key] = searchValue[key].format('YYYY-MM-DD'));
            }
            if (!(key === 'IntvSts' && searchValue[key] === 0)) {
                !searchValue[key] && delete searchValue[key];
            }
        }
        const { EntryDtBegin, EntryDtEnd, LeaveDtBegin, LeaveDtEnd } = this.view.searchValue;
        let otherParam = {};
        otherParam = {
            EntryDtBegin: EntryDtBegin ? EntryDtBegin.format('YYYY-MM-DD') : '',
            EntryDtEnd: EntryDtEnd ? EntryDtEnd.format('YYYY-MM-DD') : '',
            LeaveDtBegin: LeaveDtBegin ? LeaveDtBegin.format('YYYY-MM-DD') : '',
            LeaveDtEnd: LeaveDtEnd ? LeaveDtEnd.format('YYYY-MM-DD') : ''
        };


        try {
            const res = await getList({ ...searchValue, ...page, ...otherParam });
            this.view.dataSource = res.Data.RecordList || [];
            this.view.RecordCount = res.Data.RecordCount;
        } catch (err) {
            message.error(err.Desc || '获取名单失败');
            this.view.dataSource = [];
            this.view.RecordCount = 0;
            this.view.page = {
                RecordIndex: 0,
                RecordSize: 10
            };
        }
        this.view.loading = false;
        this.onSelectChange([], []);
    }

    // 表格选中的行
    @action
    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.view.selectedRowKeys = selectedRowKeys;
        this.view.selectedRows = selectedRows;
    }

    // 判断时否有选中的记录
    line = (visible, record) => {
        switch (visible) {
            case 'bindVisible':
                if (this.view.selectedRowKeys.length === 0) {
                    message.warn('请选择要绑定的记录。');
                } else if (this.view.selectedRows.some(item => this.view.selectedRows.some(per => item.IntvDt !== per.IntvDt || item.SrceSpId !== per.SrceSpId || item.TrgtSpId !== per.TrgtSpId || item.RealEntId !== per.RealEntId || item.WorkId !== per.WorkId))) {
                    message.warn('面试日期、企业、劳务、中介、工种要相同。');
                } else if (this.view.selectedRows.some(item => item.IntvSts !== 2)) {
                    message.warn('存在面试不通过的不能绑定订单。');
                } else if (this.view.selectedRows.some(item => item.IsValid === 2)) {
                    message.warn('存在作废的名单不能绑定订单。');
                } else if (this.view.selectedRows.some(item => item.IsBindOrder === 1)) {
                    Modal.confirm({
                        title: '所选名单已经绑定了订单了，是否要覆盖原先的订单？',
                        okText: '确定',
                        cancelText: '取消',
                        onOk: () => {
                            this.getOrderList({ EntId: this.view.selectedRows[0].RealEntId, WorkId: this.view.selectedRows[0].WorkId, OrderDt: this.view.selectedRows[0].IntvDt, SrceSpId: this.view.selectedRows[0].SrceSpId, TrgtSpId: this.view.selectedRows[0].TrgtSpId });
                            this.setVisible('bindVisible', true);
                        }
                    });
                } else {
                    this.getOrderList({ EntId: this.view.selectedRows[0].RealEntId, WorkId: this.view.selectedRows[0].WorkId, OrderDt: this.view.selectedRows[0].IntvDt, SrceSpId: this.view.selectedRows[0].SrceSpId, TrgtSpId: this.view.selectedRows[0].TrgtSpId });
                    this.setVisible('bindVisible', true);
                }
                break;
            case 'listInvalidVisible':
                if (this.view.selectedRowKeys.length === 0) {
                    message.warn('请选择要绑定的记录');
                } else {
                    this.setVisible('listInvalidVisible', true);
                    this.view.listIsValid = 2;
                }
                break;
            case 'importVisible':
                if (toJS(this.view.searchValue).StartDate && toJS(this.view.searchValue).EndDate) {
                    this.setVisible('importVisible', true);
                } else {
                    message.warn('请选择导出时间段');
                }
                break;
            case 'recoveryList':
                if (this.view.selectedRowKeys.length === 0) {
                    message.warn('请选择要恢复的记录');
                } else {
                    this.setVisible('listRecoveryVisible', true);
                    this.view.listIsValid = 1;
                }
                break;
            default: return;
        }
    }

    // 同步名单
    @action
    saveSynch = async (param) => {
        this.view.modalLoading = true;
        param = param.format('YYYY-MM-DD');
        try {
            await saveSynch({ Date: param, Cid: 1006/* authStore.authInfo.UID*/ });
            message.success('同步成功');
            this.handleFormReset();
            this.handleFormValuesChange({ ...this.view.searchValue, StartDate: moment(param), EndDate: moment(param) });
            this.getList();
        } catch (err) {
            message.error(err.Desc || '同步失败');
        }
        this.setVisible('synchVisible', false);
        this.view.modalLoading = false;
    }

    // 同步订单
    @action
    saveOrderSynch = async (param) => {
        this.view.modalLoading = true;
        param = param.format('YYYY-MM-DD');
        try {
            await SynchronousOrderList({ Date: param });
            message.success('同步成功');
            this.handleFormReset();
            this.handleFormValuesChange({ ...this.view.searchValue, StartDate: moment(param), EndDate: moment(param) });
            this.getList();
        } catch (err) {
            message.error(err.Desc || '同步失败');
        }
        this.setVisible('synchOrderVisible', false);
        this.view.modalLoading = false;
    }

    // 获取订单列表
    @action
    getOrderList = async (param) => {
        this.view.modalLoading = true;
        try {
            const res = await getBindOrderList(param);
            this.view.orderList = res.Data.RecordList || [];
        } catch (err) {
            message.error(err.Desc || '获取失败');
            this.view.orderList = [];
        }
        this.view.modalLoading = false;
    }

    // 绑定订单
    @action
    bind = async (record) => {
        if (!record) {
            message.warn('请选择绑定的订单');
            return;
        }
        this.view.modalLoading = true;
        try {
            let res = await bind({ RcrtOrderId: record.RcrtOrderId, NameIdList: toJS(this.view.selectedRowKeys) });
            message.success(res.Data);
            this.getList({ RecordIndex: this.view.page.RecordIndex, RecordSize: this.view.page.RecordSize });
        } catch (err) {
            message.error(err.Desc || '绑定失败');
        }
        this.setVisible('bindVisible', false);
        this.view.modalLoading = false;
    }

    // 订单作废&订单恢复
    @action
    listInvalid = async () => {
        this.view.modalLoading = true;
        try {
            await listInvalid({ NameIdList: this.view.selectedRowKeys, IsValid: this.view.listIsValid });
            message.success(this.view.listIsValid === 2 ? '名单作废成功' : '名单恢复成功');
            this.getList({ RecordIndex: this.view.page.RecordIndex, RecordSize: this.view.page.RecordSize });
        } catch (err) {
            message.error(err.Desc || this.view.listIsValid === 2 ? '名单作废失败' : '名单恢复失败');
        }
        this.setVisible('listInvalidVisible', false);
        this.setVisible('listRecoveryVisible', false);
        this.view.modalLoading = false;
    }
    // 导出
    @action
    importList = async () => {
        this.view.modalLoading = true;
        const searchValue = { ...{}, ...this.view.searchValue };
        for (let key in searchValue) {
            if (key === 'StartDate' || key === 'EndDate' || key === 'EntryDtBegin' || key === 'EntryDtEnd' || key === 'LeaveDtBegin' || key === 'LeaveDtEnd') {
                searchValue[key] && (searchValue[key] = searchValue[key].format('YYYY-MM-DD'));
            }
            if (!(key === 'IntvSts' && searchValue[key] === 0)) {
                !searchValue[key] && delete searchValue[key];
            }
        }
        try {
            const res = await importList(searchValue);
            window.open(res.Data.FileUrl);
            message.success('导出成功');
        } catch (err) {
            message.error(err.Desc);
        }
        this.setVisible('importVisible', false);
        this.view.modalLoading = false;
    }

    // 设置弹窗的显示和隐藏
    @action
    setVisible = (visible, flag) => {
        this.view[visible] = flag;
    }

    @action
    handleFormValuesChange = (values) => {
        this.view.searchValue = values;
    };

    @action
    handleFormReset = () => {
        this.view.resetProperty('searchValue');
    };

}