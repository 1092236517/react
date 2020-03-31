import { BaseView, BaseViewStore } from 'ADMIN/store/BaseViewStore';
import { SettleGetSummary, DealXSummary } from 'ADMIN_SERVICE/ZXX_XManager';
import { message } from 'antd';
import { action, observable } from 'mobx';

export class View extends BaseView {
    @observable searchValue = { 
        BeginDt: null,
        EndDt: null,
        DealSts: null,
        TrgtSpId: "", // 劳务ID
        EntId: "" // 企业ID
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
    // 获取1.0/2.0结算汇总表
    @action
    settleGetSummary = async () => {
        let view = this.view;
        view.RecordList = [];
        view.FormListStatus = 'pending';
        const { current, pageSize } = view.pagination;
        const { BeginDt, EndDt, TrgtSpId, EntId, DealSts } = view.searchValue;
        let query = {
            TrgtSpId: TrgtSpId ? TrgtSpId * 1 : -9999,
            EntId: EntId ? EntId * 1 : -9999,
            DealSts: DealSts ? DealSts * 1 : -9999,
            BeginDt: BeginDt ? BeginDt.format('YYYY-MM') : "",
            EndDt: EndDt ? EndDt.format('YYYY-MM') : "",
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };
        try {
            let res = await SettleGetSummary(query);
            let Data = res.Data;
            view.FormListStatus = 'done';
            view.RecordList = (Data.RecordList || []).map((item, RecordID) => ({...item, RecordID}));
            view.totalNum = Data.RecordCount;
            view.selectedRowKeys = [];
            return Data;
        } catch (error) {
            view.FormListStatus = 'error';
            message.error(error.message);
            console.log(error);
        }
    }

    // 导出1.0/2.0结算汇总表
    // @action
    // exportX = async () => {
    //     let view = this.view;
    //     view.RecordList = [];
    //     view.FormListStatus = 'pending';
    //     const { BeginDt, EndDt, TrgtSpId, EntId, DealSts } = view.searchValue;
    //     let query = {
    //         TrgtSpId: TrgtSpId ? TrgtSpId * 1 : -9999,
    //         EntId: EntId ? EntId * 1 : -9999,
    //         DealSts: DealSts ? DealSts * 1 : -9999,
    //         BeginDt: BeginDt ? BeginDt.format('YYYY-MM') : "",
    //         EndDt: EndDt ? EndDt.format('YYYY-MM') : ""
    //     };
        
    //     try {
    //         let res = await GetXSummary(query);
    //         let Data = res.Data;
    //         view.FormListStatus = 'done';
    //         message.success("导出成功！");
    //         return Data;
    //     } catch (error) {
    //         view.FormListStatus = 'error';
    //         message.error(error.message);
    //         console.log(error);
    //     }
    // }


    //  设置分页
    @action
    setPagination = (current, pageSize) => {
        let view = this.view;
        view.pagination = {
            current,
            pageSize
        };
        this.settleGetSummary();
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
        console.log(this.view.selectedRowKeys);
    }

    // 判断是否有选中的记录-批量处理
    line = async() => {
        let view = this.view;
        view.FormListStatus = 'padding';
        let Ids = [];
        view.selectedRowKeys.map((item, index) => {
            console.log("item, index:", item);
            Ids[index] = {
                EntId: view.RecordList[item - 1].EntId,
                TrgtSpId: view.RecordList[item - 1].TrgtSpId,
                RelatedMo: view.RecordList[item - 1].RelatedMo
            };
        });
        let query = {
            DealSts: 2, 
            Ids: Ids
        };
        if (view.selectedRowKeys.length === 0) {
            message.warn('请选择要处理的记录');
        } else {
            try {
                view.FormListStatus = 'done';
                let res = await DealXSummary(query);
                let Data = res.Data;
                message.success("处理成功");
                this.settleGetSummary();
                view.selectedRowKeys = [];
                return Data;
            } catch (error) {
                view.FormListStatus = 'error';
                message.error(error.message);
                console.log(error);
            }
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