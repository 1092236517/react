import { BaseView, BaseViewStore } from 'ADMIN/store/BaseViewStore';
import { NotPaySelect, NotPayExport, AddOneIdCardRecord, AddOneBankCardRecord, AddOneWorkCardRecord, getMonthlyWageExportRes } from 'ADMIN_SERVICE/ZXX_MonthBill';
import { message } from 'antd';
import { action, observable } from 'mobx';

export class View extends BaseView {
    @observable searchValue = {
        BeginDt: null,
        EndDt: null,
        TrgtSpId: null,
        EntId: null,
        IdCardNum: '',
        PreChekInfo: null,
        RealName: '',
        ReissueSts: null,
        SalaryTyp: null
    };
    @observable RecordList = [];
    @observable pagination = {
        current: 1,
        pageSize: 10
    }
    @observable totalNum = 0;
    @observable FormListStatus = 'close';

    @observable IdCardInfo = {
        IdCardNum: '',
        RealName: '',
        Mobile: ''
    };
    @observable IdCardvisible = false;
    
    @observable BankCardInfo = {};
    @observable BankCardvisible = false;

    @observable WorkCardInfo = {};
    @observable WorkCardvisible = false;
    @observable IdCardNum = "";

    @observable schedulerID = '';
}
export default class extends BaseViewStore { 
    // 应发未发列表
    @action
    NotPaySelect = async () =>{
        let view = this.view;
        const { current, pageSize } = view.pagination;
        view.RecordList = [];
        view.FormListStatus = 'pending';
        let {ReissueSts, SalaryTyp, TrgtSpId, EntId, PreChekInfo, BeginDt, EndDt, IdCardNum, RealName} = view.searchValue;
        let query = {
            TrgtSpId: TrgtSpId ? TrgtSpId * 1 : -9999,
            EntId: EntId ? EntId * 1 : -9999,
            PreChekInfo: PreChekInfo ? PreChekInfo * 1 : -9999,
            ReissueSts: ReissueSts ? ReissueSts * 1 : -9999,
            SalaryTyp: SalaryTyp ? SalaryTyp * 1 : -9999,
            BeginDt: BeginDt ? BeginDt.format('YYYY-MM') : "",
            EndDt: EndDt ? EndDt.format('YYYY-MM') : "",
            IdCardNum: IdCardNum,
            RealName: RealName,
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };
        
        try {
            let res = await NotPaySelect(query);
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

    // 应发未发列表导出
    @action
    NotPayExport = async () =>{
        let view = this.view;
        view.FormListStatus = 'pending';
        let {ReissueSts, SalaryTyp, TrgtSpId, EntId, PreChekInfo, BeginDt, EndDt, IdCardNum, RealName} = view.searchValue;
        let query = {
            TrgtSpId: TrgtSpId ? TrgtSpId * 1 : -9999,
            EntId: EntId ? EntId * 1 : -9999,
            PreChekInfo: PreChekInfo ? PreChekInfo * 1 : -9999,
            ReissueSts: ReissueSts ? ReissueSts * 1 : -9999,
            SalaryTyp: SalaryTyp ? SalaryTyp * 1 : -9999,
            BeginDt: BeginDt ? BeginDt.format('YYYY-MM') : "",
            EndDt: EndDt ? EndDt.format('YYYY-MM') : "",
            IdCardNum: IdCardNum,
            RealName: RealName
        };
        try {
            let res = await NotPayExport(query);            
            const { Data: { BizID } } = res;
            this.getMonthlyExportRes(BizID);
            view.schedulerID = setInterval(() => {
                this.getMonthlyExportRes(BizID);
            }, 2000);
        } catch(error) {
            view.FormListStatus = 'error';
            message.error(error.message);
            console.log(error);
        }
    }

    @action
    getMonthlyExportRes = async (BizID) => {
        const view = this.view;
        let reqParam = { BizID };
        try {
            let resData = await getMonthlyWageExportRes(reqParam);
            const { State, FileUrl, TaskCode, TaskDesc } = resData.Data;

            if (State == 0) {
                //    未完成
                message.loading('正在导出记录请稍候！');
            } else {
                //  已完成
                view.FormListStatus = 'done';
                window.clearInterval(view.schedulerID);
                view.schedulerID = '';
                if (TaskCode == 0) {
                    window.open(FileUrl);
                } else {
                    message.error(TaskDesc);
                }
            }
        } catch (err) {
            window.clearInterval(view.schedulerID);
            view.schedulerID = '';
            view.FormListStatus = 'error';
            message.error(err.message);
            console.log(err);
        }
    }

    // 添加身份证Modal显示/隐藏 带入初始值
    @action
    getVisible = (record) => {
        this.view.IdCardvisible = !this.view.IdCardvisible;
        this.view.IdCardInfo = {};
        if(record) {
            this.view.IdCardInfo = {
                IdCardNum: record.IdCardNum,
                Mobile: record.Mobile, 
                RealName: record.RealName
            };
        }
    }
    // 添加身份证
    @action
    AddOneIdCardRecord = async () => {
        let view = this.view;
        let query = {};
        query.IdCardNum = view.IdCardInfo.IdCardNum;
        query.Mobile = view.IdCardInfo.Mobile;
        query.RealName = view.IdCardInfo.RealName;
        try{
            view.FormListStatus = 'done';
            let res = await AddOneIdCardRecord(query);
            let Data = res.Data;
            this.view.IdCardvisible = !this.view.IdCardvisible;
            message.success("添加身份证信息成功");
            this.NotPaySelect();
            return Data;
        }catch(error) {
            message.error(error.message);
            view.FormListStatus = 'error';
            console.log(error);
        }
    }

     // 添加银行卡Modal显示/隐藏 带入初始值
     @action
    getBankCardVisible = (record) => {
        this.view.IdCardNum = "";
        this.view.BankCardInfo = {};
        this.view.BankCardvisible = !this.view.BankCardvisible;
        if(record) {
            this.view.IdCardNum = record.IdCardNum;
        }
    }

    // 添加银行卡
    @action
    AddOneBankCardRecord = async () => {
        let view = this.view;
        let query = {};
        query.BankCardNum = view.BankCardInfo.BankCardNum;
        query.BankName = view.BankCardInfo.BankName;
        query.IdCardNum = view.IdCardNum;
        query.ProvinceId = view.BankCardInfo.Alladdress[0] * 1;
        query.CityId = view.BankCardInfo.Alladdress[1] * 1;
        query.AreaId = view.BankCardInfo.Alladdress[2] * 1;
        try{
            view.FormListStatus = 'done';
            let res = await AddOneBankCardRecord(query);
            let Data = res.Data;
            this.view.BankCardvisible = !this.view.BankCardvisible;
            message.success("添加银行卡信息成功");
            
            this.NotPaySelect();
            return Data;
        }catch(error) {
            message.error(error.message);
            view.FormListStatus = 'error';
            console.log(error);
        }
    }

    // 添加工牌Modal显示/隐藏 带入初始值
    @action
    getWorkCardVisible = (record) => {
        this.view.IdCardNum = "";
        this.view.WorkCardInfo = {};
        this.view.WorkCardvisible = !this.view.WorkCardvisible;
        if(record) {
            this.view.IdCardNum = record.IdCardNum; 
        } 
    }

   // 添加工牌
   @action
    AddOneWorkCardRecord = async () => {
        let view = this.view;
        let query = {};
        query.EntId = view.WorkCardInfo.EntId;
        query.WorkCardNo = view.WorkCardInfo.WorkCardNo;
        query.IdCardNum = view.IdCardNum;
        try{
            view.FormListStatus = 'done';
            let res = await AddOneWorkCardRecord(query);
            let Data = res.Data;
            this.view.WorkCardvisible = !this.view.WorkCardvisible;
            message.success("添加工牌信息成功");
            this.NotPaySelect();
            return Data;
        }catch(error) {
            message.error(error.message);
            view.FormListStatus = 'error';
            console.log(error);
        }
    }

    @action
    setPagination = (current, pageSize) => {
        let view = this.view;
        view.pagination = {
            current,
            pageSize
        };
        this.NotPaySelect();
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

    @action
    IdCardValueChange = (values) => {
        this.view.IdCardInfo = values;
    }
    @action
    IdCardReset = () => {
        this.view.resetProperty('IdCardInfo');
    }

    @action
    BankCardValueChange = (values) => {
        this.view.BankCardInfo = values;
    }
    @action
    BankCardReset = () => {
        this.view.resetProperty('BankCardInfo');
    }

    @action
    WorkCardValueChange = (values) => {
        this.view.WorkCardInfo = values;
    }
    @action
    WorkCardReset = () => {
        this.view.resetProperty('WorkCardInfo');
    }
}