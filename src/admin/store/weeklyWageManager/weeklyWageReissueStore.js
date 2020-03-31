import { observable, action } from "mobx";
import { message } from 'antd';
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { generateWeeklyWageBatch, getResultgenerateWeeklyWageBatch, getAmountDetail } from 'ADMIN_SERVICE/ZXX_WeekBillGen';
import moment from 'moment';
import { safeMul } from 'ADMIN_UTILS/math';

export class View extends BaseView {
    @observable searchValue = {
        SettleBeginDate: moment().subtract(moment().day() + 7 + (moment().day() <= 3 ? 7 : 0), 'days'),
        SettleEndDate: moment().subtract(moment().day() - 6 + 7 + (moment().day() <= 3 ? 7 : 0), 'days'),
        EnterpriseID: undefined,
        LaborID: undefined,
        WeekSalaryType: 1
    }

    @observable tableInfo = {
        dataList: [],
        loading: false,
        UserAmount: null,
        PlatformAmount: null,
        AgentAmount: null,
        UserAmountNum: null
    };

    @observable tableVisible = false;
    //  前台轮询查询后台结果，id
    @observable schedulerID = '';
}

export default class extends BaseViewStore {
    @action
    handleFormValuesChange = (values) => {
        this.view.searchValue = values;
    }

    @action
    showNewTable = () => {
        this.view.tableVisible = true;
        this.view.tableInfo = {
            dataList: [],
            loading: false,
            UserAmount: null,
            PlatformAmount: null,
            AgentAmount: null,
            UserAmountNum: null
        };
    }

    @action
    resetOldTable = () => {
        this.view.tableVisible = false;
        this.view.tableInfo = {
            dataList: [],
            loading: false,
            UserAmount: null,
            PlatformAmount: null,
            AgentAmount: null,
            UserAmountNum: null
        };
    }

    @action
    editRecord = (record) => {
        this.view.tableInfo.UserAmountNum = null;
        this.view.tableInfo.UserAmount = null;
        this.view.tableInfo.PlatformAmount = null;
        this.view.tableInfo.AgentAmount = null;
        const { RecordID } = record;
        let index = this.view.tableInfo.dataList.findIndex((value) => {
            return value.RecordID == RecordID;
        });

        if (index >= 0) {
            //  edit
            this.view.tableInfo.dataList = [...this.view.tableInfo.dataList.slice(0, index), record, ...this.view.tableInfo.dataList.slice(index + 1)];
        } else {
            //  add
            this.view.tableInfo.dataList = [...this.view.tableInfo.dataList, record];
        }
        this.view.tableInfo.dataList.map(item=>{
            if(item.Join === 1) {
                this.view.tableInfo.UserAmount += (parseFloat(item.BaseAmount) + parseFloat(item.CreditSubsidyAmt));
                this.view.tableInfo.PlatformAmount += parseFloat(item.PlatformAmount);
                this.view.tableInfo.AgentAmount += parseFloat(item.AgentAmount);
                if(parseFloat(item.UserAmount) > 0) {
                    this.view.tableInfo.UserAmountNum += 1;
                }
            }
        });

        // this.view.tableInfo.Join = Join === 1 ? '加入对账单' : Join === 2 ? '不加入对账单' : '';
    }

    @action
    delRecord = (recordID) => {
        this.view.tableInfo.UserAmountNum = null;
        this.view.tableInfo.UserAmount = null;
        this.view.tableInfo.PlatformAmount = null;
        this.view.tableInfo.AgentAmount = null;
        let recordInfo = this.view.tableInfo.dataList.find((value) => {
            return value.RecordID == recordID;
        });
        const { RecordID, Join, UserAmount, PlatformAmount, AgentAmount, CreditSubsidyAmt, BaseAmount } = recordInfo;
        this.view.tableInfo.dataList = this.view.tableInfo.dataList.filter((value) => {
            return value.RecordID != recordID;
        });

        this.view.tableInfo.dataList.map(item=>{
            if(item.Join === 1) {
                this.view.tableInfo.UserAmount += (parseFloat(item.BaseAmount) + parseFloat(item.CreditSubsidyAmt));
                this.view.tableInfo.PlatformAmount += parseFloat(item.PlatformAmount);
                this.view.tableInfo.AgentAmount += parseFloat(item.AgentAmount);
                if(parseFloat(item.UserAmount) > 0) {
                    this.view.tableInfo.UserAmountNum += 1;
                }
            }
        });

        // console.log(this.view.tableInfo.UserAmount - parseFloat(BaseAmount) - parseFloat(CreditSubsidyAmt));
        // console.log(this.view.tableInfo.UserAmount - (parseFloat(BaseAmount) + parseFloat(CreditSubsidyAmt)));
        // this.view.tableInfo.UserAmountNum = (Join === 1 && parseFloat(UserAmount) > 0) ? (this.view.tableInfo.UserAmountNum - 1) : this.view.tableInfo.UserAmountNum;
        // this.view.tableInfo.UserAmount = Join === 1 ? (this.view.tableInfo.UserAmount - parseFloat(BaseAmount) - parseFloat(CreditSubsidyAmt)) : this.view.tableInfo.UserAmount;
        // this.view.tableInfo.PlatformAmount = Join === 1 ? (this.view.tableInfo.PlatformAmount - parseFloat(PlatformAmount)) : this.view.tableInfo.PlatformAmount;
        // this.view.tableInfo.AgentAmount = Join === 1 ? (this.view.tableInfo.AgentAmount - parseFloat(AgentAmount)) : this.view.tableInfo.AgentAmount;
    }

    @action
    commitData = async () => {
        const view = this.view;
        const {
            searchValue: { EnterpriseID, LaborID, SettleBeginDate, SettleEndDate, WeekSalaryType },
            tableInfo: { dataList }
        } = view;

        if (dataList.length == 0) {
            message.info('请先添加数据！');
            return;
        }

        let agentMap = new Map();
        dataList.forEach((agentInfo) => {
            //  map分组
            let { AgentID } = agentInfo;
            if (!agentMap.has(AgentID)) {
                agentMap.set(AgentID, []);
            }
            if (AgentID == 0) {
                agentInfo.AgentName = '没有中介';
            }

            agentMap.get(AgentID).push({
                ...agentInfo,
                Amount: safeMul(agentInfo.Amount, 100),
                AgentAmount: safeMul(agentInfo.AgentAmount, 100),
                WorkState: agentInfo.WorkState * 1,
                EntryDate: agentInfo.EntryDate.format('YYYY-MM-DD'),
                LeaveDate: agentInfo.LeaveDate ? agentInfo.LeaveDate.format('YYYY-MM-DD') : ''
            });

        });

        let BatchList = [];

        agentMap.forEach((value, key) => {
            let NameList = [];
            value.forEach((agentInfo) => {
                delete agentInfo['AgentID'];
                delete agentInfo['AgentName'];
                let obj = { ...agentInfo, FormatRes: 1, WorkDayNum: -1 };
                obj['BaseAmount'] = parseFloat(obj['BaseAmount']) * 100;
                obj['CreditSubsidyAmt'] = parseFloat(obj['CreditSubsidyAmt']) * 100;
                delete obj['Amount'];
                NameList.push(obj);
            });

            BatchList.push({
                NameList,
                SettleBeginDate: SettleBeginDate.format('YYYY-MM-DD'),
                SettleEndDate: SettleEndDate.format('YYYY-MM-DD'),
                OPType: 2
            });
        });

        let reqParam = {
            EnterpriseID: EnterpriseID || -9999,
            LaborID: LaborID || -9999,
            WeekSalaryType: WeekSalaryType || 1,
            BatchList
        };

        try {
            let resData = await generateWeeklyWageBatch(reqParam);

            this.getResultgenerateWeeklyWageBatch(resData.Data.BizID);
            clearInterval(view.schedulerID);
            view.schedulerID = setInterval(() => {
                this.getResultgenerateWeeklyWageBatch(resData.Data.BizID);
            }, 2000);
        } catch (err) {
            message.error(err.message);
            console.log(err);
        }
    }

    @action
    getResultgenerateWeeklyWageBatch = async (BizID) => {
        let view = this.view;
        let { searchValue: { EnterpriseID, LaborID } } = view;
        let reqParam = { BizID, EnterpriseID, LaborID };

        try {
            let resData = await getResultgenerateWeeklyWageBatch(reqParam);
            const { State, TaskCode, TaskDesc } = resData.Data;

            if (State == 2) {
                //  停止轮询
                clearInterval(view.schedulerID);
                if (TaskCode == 0) {
                    message.success('生成账单成功！');
                    this.resetOldTable();
                } else {
                    //  完成，但是失败
                    message.error(TaskDesc);
                }
            } else if (State == 1) {
                //  任务还在进行中
                message.loading('正在提交账单');
            } else {
                //  任务超时
                message.error('生成账单超时！请稍后再试！');
                clearInterval(view.schedulerID);
            }
        } catch (err) {
            //  停止轮询
            clearInterval(view.schedulerID);
            message.error(err.message);
            console.log(err);
        }
    }
    @action
    getAmountDetail = async (Amount) => {
        let view = this.view;
        let { searchValue: { EnterpriseID, LaborID } } = view;
        let reqParam = { Amount };

        try {
            let resData = await getAmountDetail(reqParam);
            const { State, TaskCode, TaskDesc } = resData.Data;
        } catch (err) {
            //  停止轮询
            clearInterval(view.schedulerID);
            message.error(err.message);
            console.log(err);
        }
    }
}
