import { BaseView, BaseViewStore } from 'ADMIN/store/BaseViewStore';
import { Platform } from 'ADMIN_SERVICE/ZXX_Busi_Manage';
import { message } from 'antd';
import { action, observable } from 'mobx';

export class View extends BaseView {
    @observable searchValue = { // 平台盈利列表查询
        BeginDt: null,
        EndDt: null,
        BillBatchId: null,
        BillBatchTyp: -9999, // 批次类型
        EntId: null, // 企业ID
        SrceSpId: null, // 中介ID
        TrgtSpId: null // 劳务ID
    };
    @observable TotalSum = 0;
    @observable RecordList = [];
    @observable pagination = {
        current: 1,
        pageSize: 10
    }
    @observable totalNum = 0 ;
    @observable FormListStatus = 'close';
}
export default class extends BaseViewStore {
    // 获取平台盈利列表
    @action
    platform = async () =>{
        let view = this.view;
        view.RecordList = [];
        view.FormListStatus = 'pending';
        const { current, pageSize } = view.pagination;
        const { BeginDt, EndDt, BillBatchId, BillBatchTyp, EntId, SrceSpId, TrgtSpId } = view.searchValue;
        let query = { 
            BillBatchTyp: BillBatchTyp ? BillBatchTyp * 1 : -9999, 
            EntId: EntId ? EntId * 1 : -9999,
            SrceSpId: SrceSpId ? SrceSpId * 1 : -9999,
            TrgtSpId: TrgtSpId ? TrgtSpId * 1 : -9999,
            BillBatchId: BillBatchId ? BillBatchId * 1 : -9999,
            BeginDt: BeginDt ? BeginDt.format('YYYY-MM-DD') : "",
            EndDt: EndDt ? EndDt.format('YYYY-MM-DD') : "",
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };
        try {
            let res = await Platform(query);
            let Data = res.Data;
            view.FormListStatus = 'done';
            view.RecordList = Data.RecordList || [];
            view.totalNum = Data.RecordCount;
            view.TotalSum = Data.TotalSum;
            return Data;
        } catch(error) {
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
        this.platform();
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
        this.view.searchValue = values;
    }

    @action
    handleFormReset = () => {
        this.view.resetProperty('searchValue');
    }

}