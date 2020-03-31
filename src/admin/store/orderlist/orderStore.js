import { observable, action, toJS } from "mobx";
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { message } from 'antd';
import moment from 'moment';
import { orderInvalid, importOrderList, addOrder, getOrderList, SynchronousOrderList } from 'ADMIN_SERVICE/ZXX_OrderManager';

export class View extends BaseView {
    @observable searchValue = {
        EntId: undefined,
        FromSpId: undefined,
        IsValid: -9999,
        ToSpId: undefined,
        StartDate: moment().subtract(7, 'days'),
        EndDate: moment(),
        EmploymentType: -9999,
        SettlementTyp: -9999
    };
    @observable selectedRowKeys = [];
    @observable selectedRows = [];
    @observable page = {
        RecordIndex: 1,
        RecordSize: 10
    };
    @observable RecordCount = 0;
    // 订单列表
    @observable dataSource = [];
    @observable dataDetails = '';
    @observable flag = false; // 标记是否有新增
    @observable loading = false;
    @observable synchOrderVisible = false; // 同步订单
    @observable batchSynchOrderVisible = false; // 批量同步订单
    @observable orderInvalidVisible = false;
    @observable orderDetailsVisible = false;
    @observable orderRemarkVisible = false;
    @observable importVisible = false;
    @observable addVisible = false;
    @observable modalLoading = false;
    @observable batchUpdataObj = {
        StartDateParam: null,
        EndDateParam: null,
        schedulerID: '',
        Code: 0
    }
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
            !searchValue[key] && delete searchValue[key];
        }
        try {
            const res = await getOrderList({ ...searchValue, ...page });
            this.view.dataSource = res.Data.RecordList || [];
            this.view.RecordCount = res.Data.RecordCount;
        } catch (err) {
            message.error(err.Desc || '获取订单失败');
            this.view.dataSource = [];
            this.view.RecordCount = 0;
            this.view.page = {
                RecordIndex: 0,
                RecordSize: 10
            };
        }
        this.view.flag = false;
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
            case 'orderInvalidVisible':
                if (this.view.selectedRowKeys.length === 0) {
                    message.warn('请选择要绑定的记录');
                } else {
                    this.setVisible('orderInvalidVisible', true);
                }
                break;
            case 'importVisible':
                if (toJS(this.view.searchValue).StartDate && toJS(this.view.searchValue).EndDate) {
                    this.setVisible('importVisible', true);
                } else {
                    message.warn('请选择导出时间段');
                }
                break;
            default: return;
        }
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

    // 批量同步订单
    @action
    saveOrderBatchSynch = async ({ StartDateParam, EndDateParam }) => {
        this.view.modalLoading = true;
        this.view.batchUpdataObj = {
            ... this.view.batchUpdataObj,
            StartDateParam: StartDateParam,
            EndDateParam: EndDateParam
        };

        try {
            let schedulerID = this.view.batchUpdataObj;
            clearInterval(schedulerID);
            schedulerID = setInterval(() => {
                this.exeSynchronousOrderList();
            }, 2000);
            this.view.batchUpdataObj = {
                ... this.view.batchUpdataObj,
                schedulerID: schedulerID
            };
        } catch (err) {
            message.error(err.Desc || '同步失败');
        }
        this.setVisible('batchSynchOrderVisible', false);
        this.view.modalLoading = false;
    }
    // @action
    exeSynchronousOrderList = async () => {
        let { batchUpdataObj: { StartDateParam, EndDateParam, Code, schedulerID } } = this.view;
        if (typeof (Code) !== 'undefined') {
            if (Code === 0 && !StartDateParam.isAfter(EndDateParam, 'day')) {
                let StartDate = StartDateParam;
                let currentRecord = await SynchronousOrderList({ Date: StartDate.format('YYYY-MM-DD') });
                StartDate = StartDateParam.add(1, 'days');
                this.view.batchUpdataObj = {
                    ...this.view.batchUpdataObj,
                    StartDateParam: StartDate
                };
                this.view.batchUpdataObj = {
                    ...this.view.batchUpdataObj,
                    Code: currentRecord.Code
                };
            }

            if (StartDateParam.isSame(EndDateParam, 'day')) {
                await SynchronousOrderList({ Date: StartDateParam.format('YYYY-MM-DD') });
                clearInterval(schedulerID);
                message.success('同步成功');
                this.handleFormReset();
                this.handleFormValuesChange({ ...this.view.searchValue, StartDate: EndDateParam, EndDate: EndDateParam });
                this.getList();
            }
        }
    }

    // 新增
    @action
    addOrder = async (param, callback) => {
        this.view.modalLoading = true;
        try {
            await addOrder(param);
            message.success('新增成功');
            this.view.flag = true;
            this.view.searchValue = { ...this.view.searchValue, StartDate: moment(param.OrderDt), EndDate: moment(param.OrderDt) };
            callback();
        } catch (err) {
            message.error(err.Desc || '新增失败');
        }
        this.view.modalLoading = false;
    }

    // 订单作废
    @action
    orderInvalid = async () => {
        this.view.modalLoading = true;
        try {
            let res = await orderInvalid({ OrderIdList: this.view.selectedRowKeys });
            message.success(res.Data);
            this.getList({ RecordIndex: this.view.page.RecordIndex, RecordSize: this.view.page.RecordSize });
        } catch (err) {
            message.error(err.Desc || '订单作废失败');
        }
        this.setVisible('orderInvalidVisible', false);
        this.view.modalLoading = false;
    }

    // 导出
    @action
    importList = async () => {
        this.view.modalLoading = true;
        const searchValue = { ...{}, ...this.view.searchValue };
        for (let key in searchValue) {
            if (key === 'StartDate' || key === 'EndDate') {
                searchValue[key] && (searchValue[key] = searchValue[key].format('YYYY-MM-DD'));
            }
            !searchValue[key] && delete searchValue[key];
        }
        try {
            const res = await importOrderList(searchValue);
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
        this.view.modalLoading = true;
        this.view[visible] = flag;
        this.view.modalLoading = false;
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