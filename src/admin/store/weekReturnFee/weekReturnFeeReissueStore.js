import { observable, action } from "mobx";
import { message } from 'antd';
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { geneBatch, getGeneBatchRes } from 'ADMIN_SERVICE/ZXX_WeekReturnFee';
import moment from 'moment';
import { safeMul } from 'ADMIN_UTILS/math';

export class View extends BaseView {
    @observable searchValue = {
        SettleBeginDate: moment().subtract(moment().day() + 7 + (moment().day() <= 3 ? 7 : 0), 'days'),
        SettleEndDate: moment().subtract(moment().day() - 6 + 7 + (moment().day() <= 3 ? 7 : 0), 'days'),
        EnterpriseID: undefined,
        LaborID: undefined
    }

    @observable tableInfo = {
        dataList: [],
        loading: false
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
            loading: false
        };
    }

    @action
    resetOldTable = () => {
        this.view.tableVisible = false;
        this.view.tableInfo = {
            dataList: [],
            loading: false
        };
    }

    @action
    editRecord = (record) => {
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
    }

    @action
    delRecord = (recordID) => {
        this.view.tableInfo.dataList = this.view.tableInfo.dataList.filter((value) => {
            return value.RecordID != recordID;
        });
    }

    @action
    commitData = async () => {
        const view = this.view;
        const {
            searchValue: { EnterpriseID, LaborID, SettleBeginDate, SettleEndDate },
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
                NameList.push({ ...agentInfo, FormatRes: 1, WorkDayNum: -1 });
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
            BatchList
        };

        try {
            let resData = await geneBatch(reqParam);

            this.getGeneBatchRes(resData.Data.BizID);
            clearInterval(view.schedulerID);
            view.schedulerID = setInterval(() => {
                this.getGeneBatchRes(resData.Data.BizID);
            }, 2000);
        } catch (err) {
            message.error(err.message);
            console.log(err);
        }
    }

    @action
    getGeneBatchRes = async (BizID) => {
        let view = this.view;
        let { searchValue: { EnterpriseID, LaborID } } = view;
        let reqParam = { BizID, EnterpriseID, LaborID };

        try {
            let resData = await getGeneBatchRes(reqParam);
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
}