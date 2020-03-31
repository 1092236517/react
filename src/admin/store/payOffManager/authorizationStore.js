import { BaseView, BaseViewStore } from 'ADMIN/store/BaseViewStore';
import { Audit, QueryAudit } from 'ADMIN_SERVICE/ZXX_Remit';
import { message } from 'antd';
import { action, observable } from 'mobx';
export class View extends BaseView {
    @observable searchValue = { // 发薪申请列表查询
        SettleBeginDt: null,
        SettleEndDt: null,
        BillBatchId: null, // 批次号
        BillSrce: -9999, // 账单来源
        BillBatchTyp: -9999, // 批次类型
        AuthSts: -9999, // 审核状态
        EntId: "", // 企业ID
        SrceSpId: "", // 中介ID
        TrgtSpId: "" // 劳务ID
    };
    @observable RecordList = [];
    @observable pagination = {
        current: 1,
        pageSize: 10
    }
    @observable totalNum = 0;
    @observable FormListStatus = 'close';
}
export default class extends BaseViewStore {
    // 获取授权列表
    @action
    queryAudit = async () =>{
        let view = this.view;
        view.RecordList = [];
        view.FormListStatus = 'pending';
        const { current, pageSize } = view.pagination;
        const { SettleBeginDt, SettleEndDt, BillBatchId, BillSrce, BillBatchTyp, AuthSts, EntId, SrceSpId, TrgtSpId } = view.searchValue;
        let query = { 
            BillSrce: BillSrce ? BillSrce * 1 : -9999, 
            BillBatchTyp: BillBatchTyp ? BillBatchTyp * 1 : -9999, 
            AuthSts: AuthSts ? AuthSts * 1 : -9999, 
            EntId: EntId ? EntId * 1 : -9999,
            SrceSpId: SrceSpId ? SrceSpId * 1 : -9999,
            TrgtSpId: TrgtSpId ? TrgtSpId * 1 : -9999,
            BillBatchId: BillBatchId ? BillBatchId * 1 : -9999,
            SettleBeginDt: SettleBeginDt ? SettleBeginDt.format('YYYY-MM-DD') : "",
            SettleEndDt: SettleEndDt ? SettleEndDt.format('YYYY-MM-DD') : "",
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };

        try {
            let res = await QueryAudit(query);
            let Data = res.Data;
            view.FormListStatus = 'done';
            view.RecordList = Data.RecordList || [];
            view.totalNum = Data.RecordCount;
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
        this.queryAudit();
    }

    @action
    resetPageCurrent = () => {
        let view = this.view;
        view.pagination = {
            ...view.pagination,
            current: 1
        };
    }

    // 确认授权
    @action
    audit = async (id) => {
        let view = this.view;
        view.FormListStatus = 'pending';
        let query = {ApplyID: id};
        try{
            view.FormListStatus = 'done';
            let res = await Audit(query);
            let Data = res.Data;
            message.success("授权成功");
            this.queryAudit();
            return Data;
        }catch(error) {
            view.FormListStatus = 'error';
            message.error(error.message);
            console.log(error);
        }
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
    handleFormReset = () => {
        this.view.resetProperty('searchValue');
    }

}