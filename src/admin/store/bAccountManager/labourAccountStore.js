import { BaseView, BaseViewStore } from 'ADMIN/store/BaseViewStore';
import getClient from 'ADMIN_COMPONENTS/AliyunUpload/getClient';
import uploadRule from 'ADMIN_CONFIG/uploadRule';
import { ExportSpAccountFlow, ExportTrgtSpList, GetSpAccountBillDetail, GetSpAccountFlow, GetTrgtSp } from 'ADMIN_SERVICE/ZXX_Busi_Manage';
import { message } from 'antd';
import { action, observable } from 'mobx';

export class View extends BaseView {
    @observable searchValue = { // 劳务查询
        SpId: null, // 劳务id
        CtctName: "", // 联系人
        CtctMobile: "" // 联系电话
    };

    @observable detailValue = { // 劳务的账户流水
        StartDt: null,
        EndDt: null,
        BillBatchId: null, // 批次号
        SpId: -9999, // 劳务Id
        TradeTyp: -9999 // 交易类型
    };

    @observable labourInfo = { // 劳务账户明细中---劳务信息
        SpFullName: "", 
        SpShortName: "",
        CtctName: "",
        CtctMobile: "",
        AccntBalance: 0, 
        TotInAmt: 0,
        TotOutAmt: 0, 
        RecordCount: 0,
        TotForCash: 0,
        TotalChangeAmount: 0,
        DepositAccntBalance: 0,
        TotForCashY: 0,
        TotInAmtY: 0
    };

    @observable TypeList = []; // 交易类型
    @observable detailId = null; // 劳务id
    @observable RecordList = [];
    @observable DetailRecordList = [];
    @observable billDetail = {};
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
    // 获取劳务信息列表
    @action
    getTrgtSp = async () =>{
        let view = this.view;
        const { current, pageSize } = view.pagination;
        view.RecordList = [];
        view.FormListStatus = 'pending';
        let {SpId, CtctName, CtctMobile} = view.searchValue;
        let query = {
            SpId: SpId ? SpId * 1 : -9999,
            CtctName: CtctName,
            CtctMobile: CtctMobile,
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };
        
        try {
            let res = await GetTrgtSp(query);
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

    // 获取劳务账户明细
    @action
    getSpAccountFlow = async () =>{
        let view = this.view;
        const { current, pageSize } = view.detailpagination;
        view.DetailRecordList = [];
        view.FormListStatus = 'pending';
        let {StartDt, EndDt, BillBatchId, TradeTyp} = view.detailValue;
        let query = {
            TradeTyp: TradeTyp ? TradeTyp * 1 : -9999,
            BillBatchId: BillBatchId ? BillBatchId * 1 : -9999,
            SpId: view.detailId ? view.detailId * 1 : -9999,
            StartDt: StartDt ? StartDt.format('YYYY-MM-DD') : "",
            EndDt: EndDt ? EndDt.format('YYYY-MM-DD') : "",
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };
        
        try {
            let res = await GetSpAccountFlow(query);
            let Data = res.Data;
            view.FormListStatus = 'done';
            view.DetailRecordList = Data.RecordList || [];
            view.detailtotalNum = Data.RecordCount;
            view.labourInfo = {
                SpFullName: Data.SpFullName, 
                SpShortName: Data.SpShortName,
                CtctName: Data.CtctName,
                CtctMobile: Data.CtctMobile,
                AccntBalance: Data.AccntBalance, 
                TotInAmt: Data.TotInAmt,
                TotOutAmt: Data.TotOutAmt, 
                RecordCount: Data.RecordCount,
                TotForCash: Data.TotForCash,
                TotalChangeAmount: Data.TotalChangeAmount,
                DepositAccntBalance: Data.DepositAccntBalance,
                TotForCashY: Data.TotForCashY,
                TotInAmtY: Data.TotInAmtY
            };
            return Data;
        } catch(error) {
            view.FormListStatus = 'error';
            message.error(error.message);
            console.log(error);
        }
    }

    // 获取单笔交易流水明细
    @action
    getSpAccountBillDetail = async (id) =>{
        let view = this.view;
        view.FormListStatus = 'pending';
        let query = {TradeId: id};
        try {
            let res = await GetSpAccountBillDetail(query);
            let Data = res.Data;
            view.FormListStatus = 'done';
            view.billDetail = Data;
            const aliyunClient = await getClient(uploadRule.labourCertificate);
            view.billDetail.EvidenceUrl = aliyunClient.signatureUrl(Data.EvidenceUrl);
            return Data;
        } catch(error) {
            view.FormListStatus = 'error';
            message.error(error.message);
            console.log(error);
        }
    }

    // 劳务列表导出
    @action
    exportTrgtSpList = async () =>{
        let view = this.view;
        view.FormListStatus = 'pending';
        let {SpId, CtctName, CtctMobile} = view.searchValue;
        let query = {
            SpId: SpId ? SpId * 1 : -9999,
            CtctName: CtctName,
            CtctMobile: CtctMobile
        };
        try {
            let res = await ExportTrgtSpList(query);
            let Data = res.Data;
            view.FormListStatus = 'done';
            return Data;
        } catch(error) {
            view.FormListStatus = 'error';
            message.error(error.message);
            console.log(error);
        }
    }

    // 劳务账单详细信息导出
    @action
    exportSpAccountFlow = async () =>{
        let view = this.view;
        view.FormListStatus = 'pending';
        let {StartDt, EndDt, BillBatchId, TradeTyp} = view.detailValue;
        let query = {
            TradeTyp: TradeTyp ? TradeTyp * 1 : -9999,
            BillBatchId: BillBatchId ? BillBatchId * 1 : -9999,
            SpId: view.detailId ? view.detailId * 1 : -9999,
            StartDt: StartDt ? StartDt.format('YYYY-MM-DD') : "",
            EndDt: EndDt ? EndDt.format('YYYY-MM-DD') : ""
        };
        try {
            let res = await ExportSpAccountFlow(query);
            let Data = res.Data;
            view.FormListStatus = 'done';
            return Data;
        } catch(error) {
            view.FormListStatus = 'error';
            message.error(error.message);
            console.log(error);
        }
    }

    // 获取劳务ID
    @action
    getDetailId = (id) => {
        this.view.detailId = id;
    }

    //  设置劳务列表分页
    @action
    setPagination = (current, pageSize) => {
        let view = this.view;
        view.pagination = {
            current,
            pageSize
        };
        console.log(132, view.pagination);
        this.getTrgtSp();
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
        this.getSpAccountFlow();
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
    getTradId = (id) => {
        this.view.TypeID = id;
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