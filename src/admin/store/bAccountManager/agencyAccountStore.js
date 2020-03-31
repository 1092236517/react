import { BaseView, BaseViewStore } from 'ADMIN/store/BaseViewStore';
import { observable, action } from 'mobx';
import {message} from 'antd';
import {GetAgentAccount, GetAgentDetail, ExportAgentAccount, ExportAgentDetail} from 'ADMIN_SERVICE/ZXX_Busi_Manage';

export class View extends BaseView {
    @observable searchValue = { // 中介查询
        SrceSpId: null, // 中介id
        CtctName: "", // 联系人
        CtctMobile: "" // 联系电话
    };

    @observable detailValue = { // 中介账号明细查询
        BeginDt: null,
        EndDt: null,
        BatchId: null, // 批次号
        SrceSpId: "" // 中介Id
    };

    @observable agencyInfo = { // 中介账户明细---中介信息
        SrceSpFullName: "", 
        SrceSpShortName: "",
        CtctName: "",
        CtctMobile: "",
        AgentAmt: 0
    };

    @observable AgentAllAmt = 0; // 变动金额

    @observable detailId = null; // 中介id
    @observable TradeId = null; // 交易id

    @observable RecordList = [];
    @observable DetailRecordList = [];
    @observable tempRecordList = [];

    @observable pagination = {
        current: 1,
        pageSize: 10
    }
    @observable detailpagination = {
        current: 1,
        pageSize: 10
    }

    @observable totalNum = 0;
    @observable detailtotalNum = 0;
    
    @observable FormListStatus = 'close';
}
export default class extends BaseViewStore {
    // 获取中介信息列表
    @action
    getAgentAccount = async () =>{
        let view = this.view;
        const { current, pageSize } = view.pagination;
        view.RecordList = [];
        view.FormListStatus = 'pending';
        let {SrceSpId, CtctName, CtctMobile} = view.searchValue;

        let query = {
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };
        if (CtctName !== "") {
            query.CtctName = CtctName;
        }
        if (CtctMobile !== "") {
            query.CtctMobile = CtctMobile;
        }
        if (SrceSpId !== null) {
            query.SrceSpId = SrceSpId;
        }
        try {
            let res = await GetAgentAccount(query);
            let Data = res.Data;
            view.FormListStatus = 'done';
            view.RecordList = Data.RecordList || [];
            view.totalNum = Data.RecordCount;
            view.tempRecordList = Data.RecordList || [];
            return Data;
        } catch(error) {
            view.FormListStatus = 'error';
            message.error(error.message);
            console.log(error);
        }
    }

    // 获取中介账户明细
    @action
    getAgentDetail = async () =>{
        let view = this.view;
        const { current, pageSize } = view.pagination;
        view.DetailRecordList = [];
        view.FormListStatus = 'pending';
        let {BeginDt, EndDt, BatchId} = view.detailValue;
        let query = {
            BatchId: BatchId !== null ? BatchId * 1 : -9999,
            SrceSpId: view.detailId * 1,
            BeginDt: BeginDt ? BeginDt.format('YYYY-MM-DD') : "",
            EndDt: EndDt ? EndDt.format('YYYY-MM-DD') : "",
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };
        try {
            let res = await GetAgentDetail(query);
            let Data = res.Data;
            view.FormListStatus = 'done';
            view.DetailRecordList = (Data.RecordList || []).map((item, primaryIndex) => ({...item, primaryIndex}));
            view.detailtotalNum = Data.RecordCount;
            view.AgentAllAmt = Data.AgentAllAmt;
            return Data;
        } catch(error) {
            view.FormListStatus = 'error';
            message.error(error.message);
            console.log(error);
        }
    }

    // 中介列表导出
    @action
    exportAgentAccount = async () =>{
        let view = this.view;
        view.FormListStatus = 'pending';
        let {SrceSpId, CtctName, CtctMobile} = view.searchValue;
        let query = {};
        if (CtctName !== "") {
            query.CtctName = CtctName;
        }
        if (CtctMobile !== "") {
            query.CtctMobile = CtctMobile;
        }
        if (SrceSpId !== null) {
            query.SrceSpId = SrceSpId;
        }

        try {
            let res = await ExportAgentAccount(query);
            let Data = res.Data;
            view.FormListStatus = 'done';
            return Data;
        } catch(error) {
            view.FormListStatus = 'error';
            message.error(error.message);
            console.log(error);
        }
    }

    // 中介账单详细信息导出
    @action
    exportAgentDetail = async () =>{
        let view = this.view;
        view.FormListStatus = 'pending';
        let {BeginDt, EndDt, BatchId} = view.detailValue;
        let query = {
            BatchId: BatchId !== null ? BatchId * 1 : -9999,
            BeginDt: BeginDt ? BeginDt.format('YYYY-MM-DD') : "",
            EndDt: EndDt ? EndDt.format('YYYY-MM-DD') : "",
            SrceSpId: view.detailId * 1
        };
        try {
            let res = await ExportAgentDetail(query);
            let Data = res.Data;
            view.FormListStatus = 'done';
            return Data;
        } catch(error) {
            view.FormListStatus = 'error';
            message.error(error.message);
            console.log(error);
        }
    }

    // 获取中介详情ID
    @action
    getTradeId = (id) => {
        this.view.TradeId = id;
    }

    // 获取中介ID
    @action
    getDetailId = (id) => {
        this.view.detailId = id;
    }

    //  设置分页
    @action
    setPagination = (current, pageSize) => {
        let view = this.view;
        view.pagination = {
            current,
            pageSize
        };
        this.getAgentAccount();
    }

    @action
    resetPageCurrent = () => {
        let view = this.view;
        view.pagination = {
            ...view.pagination,
            current: 1
        };
    }

    // 设置劳务明细分页
    @action
    setdetailPagination = (current, pageSize) => {
        let view = this.view;
        view.detailpagination = {
            current,
            pageSize
        };
        this.getAgentDetail();
    }

    @action
    resetdetailPageCurrent = () => {
        let view = this.view;
        view.detailpagination = {
            ...view.detailpagination,
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

    // detailValue
    @action 
    handleDetailFormValuesChange = (values) => {
        this.view.detailValue = values;
    }

    @action
    handleDetailFormReset = () => {
        this.view.resetProperty('detailValue');
    }

}