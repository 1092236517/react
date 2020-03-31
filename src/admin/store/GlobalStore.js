import { observable, action } from "mobx";
import { message } from 'antd';
import { getAllCompanyInfo, getAllBankPayAcct } from 'ADMIN_SERVICE/ZXX_BaseData';

import { getBankList } from 'ADMIN_SERVICE/ZXX_SystemCfg';

/**
 * 通用的Store，在多个页面 用同一数据源，可以在这里定义
 */
export default class {
    //  中介数据
    @observable agentList = [];

    //  企业数据
    @observable companyList = [];

    //  劳务数据
    @observable laborList = [];

    //  是否有企业 中介 劳务数据
    @observable hasAllCompanyInfo = false;

    // 银行名称
    @observable bankList = [];

    //  付款账户名称
    @observable bankPayAccountList = [];

    //  获取全部三方数据。企业+劳务+中介
    @action.bound
    async getAllCompanyInfo() {
        try {
            const res = await getAllCompanyInfo({
                SpTypeList: [1, 2, 3]
            });
            this.hasAllCompanyInfo = true;
            this.agentList = res.Data.AgentList || [];
            this.companyList = res.Data.CompanyList || [];
            this.laborList = res.Data.LaborList || [];
            return res.Data;
        } catch (err) {
            message.error(err.message);
            console.log(err);
        }
    }

    //  单独获取企业列表
    @action.bound
    async getCompanyList() {
        try {
            const res = await getAllCompanyInfo({
                SpTypeList: [1]
            });
            this.companyList = res.Data.CompanyList || [];
            return res.Data.CompanyList;
        } catch (err) {
            message.error(err.message);
            console.log(err);
        }
    }

    //  单独获取劳务列表
    @action.bound
    async getLaborList() {
        try {
            const res = await getAllCompanyInfo({
                SpTypeList: [2]
            });
            this.laborList = res.Data.LaborList || [];
            return res.Data.LaborList;
        } catch (err) {
            message.error(err.message);
            console.log(err);
        }
    }

    //  单独获取中介列表
    @action.bound
    async getAgentList() {
        try {
            const res = await getAllCompanyInfo({
                SpTypeList: [3]
            });
            this.agentList = res.Data.AgentList || [];
            return res.Data.AgentList;
        } catch (err) {
            message.error(err.message);
            console.log(err);
        }
    }

    @action.bound
    getAgentText(agentID) {
        let res = this.agentList.find((value) => {
            return value.SpId == agentID;
        });
        return res == undefined ? '' : res.SpShortName;
    }

    @action.bound
    getLaborText(laborID) {
        let res = this.laborList.find((value) => {
            return value.SpId == laborID;
        });
        return res == undefined ? '' : res.SpShortName;
    }

    @action.bound
    getCompanyText(companyID) {
        let res = this.companyList.find((value) => {
            return value.EntId == companyID;
        });
        return res == undefined ? '' : res.EntShortName;
    }

    @action
    getBankList = async() => {
        try {
            const res = await getBankList();
            this.bankList = res.Data.RecordList;
            return res.Data.AgentList;
        } catch (err) {
            message.error(err.message);
        }
    }

    @action
    getAllBankPayAcct = async() => {
        try {
            const res = await getAllBankPayAcct();
            this.bankPayAccountList = res.Data.RecordList;
            return res.Data.RecordList;
        } catch (err) {
            message.error(err.message);
        }
    }
}