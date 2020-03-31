import { observable, action, computed } from "mobx";
import { message } from 'antd';
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { importMonthlyWageCheck, generateMonthlyWageBatchByBiz, getResutltGenerateMonthlyWageBatch, getResultImportMonthlyWageCheck, getResultFromAliyun, exportPreview } from 'ADMIN_SERVICE/ZXX_MonthBillGen';

export class View extends BaseView {
    @observable searchValue = {
        SheetName: 'sheet1',
        EnterpriseID: undefined,
        LaborID: undefined,
        Month: undefined,
        SalaryType: undefined,
        GeneratePayroll: undefined
    }

    @observable tableInfo = {
        //  原始数据
        dataList: [],
        //  当前显示的数据
        dataListShow: [],
        loading: false,
        //  表格筛选条件
        filterInfo: null
    };


    //  当前所选中介ID
    @observable selectAgentID = -1;
    //  选中的加入对账单状态。保证每次提交一个中介后，能重置该值
    @observable selectJoinState = '0';

    @observable importFile = [];
    @observable tableVisible = false;
    @observable fileMD5 = '';
    @observable showSpin = false;

    //  前台轮询查询后台结果，id
    @observable schedulerID = '';
    //  导入任务操作ID
    @observable ImportBizID = '';
}

export default class extends BaseViewStore {
    @action
    handleFormValuesChange = (values) => {
        this.view.searchValue = values;
    }

    @action
    setImportFile = (id, list) => {
        if (id == 'ImportFile') {
            this.view.importFile = [...list];
        }
    }

    @action
    importPreview = async () => {
        const view = this.view;
        const {
            searchValue: {
                SheetName,
                EnterpriseID,
                LaborID,
                Month,
                SalaryType
            },
            importFile
        } = view;

        view.tableInfo.loading = true;

        let reqParam = {
            SheetName,
            BucketKey: importFile[0].response.bucket,
            EnterpriseID,
            FileName: importFile[0].response.name.substr(1),
            LaborID,
            Month: Month ? Month.format('YYYY-MM') : '',
            SalaryType
        };

        try {
            view.tableVisible = true;
            let resData = await importMonthlyWageCheck(reqParam);
            view.ImportBizID = resData.Data.BizID;
            this.getResultImportMonthlyWageCheck();
            clearInterval(view.schedulerID);
            view.schedulerID = setInterval(() => {
                this.getResultImportMonthlyWageCheck();
            }, 2000);

        } catch (err) {
            view.tableInfo.loading = false;
            message.error(err.message);
            console.log(err);
        }
    }

    @action
    getResultImportMonthlyWageCheck = async () => {
        let view = this.view;
        let { searchValue: { EnterpriseID, LaborID } } = view;

        let reqParam = { BizID: view.ImportBizID, EnterpriseID, LaborID };

        try {
            let resData = await getResultImportMonthlyWageCheck(reqParam);
            const { State, ResultUrl } = resData.Data;

            if (State == 2) {
                let aliRes = await getResultFromAliyun(ResultUrl);
                const { TaskCode, TaskDesc, RecordList = [], FileMd5 } = aliRes.Data;

                //  停止轮询
                clearInterval(view.schedulerID);
                view.tableInfo.loading = false;
                if (TaskCode == 0) {
                    view.tableInfo = {
                        dataList: RecordList,
                        dataListShow: []
                    };

                    view.fileMD5 = FileMd5;
                    this.initFirstAgent();
                } else {
                    //  完成，但是失败
                    message.error(TaskDesc);
                }
            } else if (State == 1) {
                //  任务还在进行中
                message.loading('正在执行导入检查');
            } else {
                //  任务超时
                message.error('导入检查操作超时！请稍后再试！');
                clearInterval(view.schedulerID);
                view.tableInfo.loading = false;
            }
        } catch (err) {
            //  停止轮询
            clearInterval(view.schedulerID);
            view.tableInfo.loading = false;
            message.error(err.message);
            console.log(err);
        }
    }

    @computed
    get agentClassify() {
        const data = this.view.tableInfo.dataList.slice();
        let agentMap = new Map();
        data.forEach((agentInfo) => {
            let { AgentID } = agentInfo;
            let agentInfoX = { ...agentInfo };
            if (!agentMap.has(AgentID)) {
                agentMap.set(AgentID, []);
            }
            if (AgentID == 0) {
                agentInfoX.AgentName = '没有中介';
            }
            agentMap.get(AgentID).push(agentInfoX);
        });
        return agentMap;
    }

    @computed
    get agentList() {
        let agents = [];
        const agentMap = this.agentClassify;
        agentMap.forEach((value, key) => {
            agents.push([key, value[0].AgentName]);
        });
        return agents;
    }

    @action
    switchAgent = (agentID) => {
        this.view.tableInfo.dataListShow = this.view.tableInfo.dataList.filter((value) => {
            return value.AgentID == agentID;
        });
        this.view.selectAgentID = agentID;
        //  重置加入对账单select
        this.view.selectJoinState = '0';
        //  重置筛选条件
        this.view.tableInfo = {
            ...this.view.tableInfo,
            filterInfo: {
                Join: [1, 2]
            }
        };
    }

    //  一个中介数据
    @computed
    get joinBatchCountInAgent() {
        return this.view.tableInfo.dataListShow.filter((value) => {
            return value.Join == 1;
        }).length;
    }

    //  一个中介数据
    @computed
    get totalCountInAgent() {
        return this.view.tableInfo.dataListShow.length;
    }

    @action
    generateBatch = async () => {
        const view = this.view;
        const {
            searchValue: {
                EnterpriseID,
                LaborID,
                Month,
                SalaryType,
                GeneratePayroll
            },
            tableInfo: {
                dataListShow
            },
            selectAgentID,
            fileMD5,
            tableVisible,
            ImportBizID
        } = view;

        if (!tableVisible) {
            message.info('请先导入预览');
            return;
        }

        let reqParam = {
            ImportBizID,
            AgentID: selectAgentID,
            EnterpriseID,
            FileMd5: fileMD5,
            FileName: view.importFile[0].response.name.substr(1),
            LaborID,
            OPType: 1,
            Month: Month ? Month.format('YYYY-MM') : '',
            SalaryType,
            GeneratePayroll
        };

        try {
            view.showSpin = true;
            let resData = await generateMonthlyWageBatchByBiz(reqParam);

            this.getResutltGenerateMonthlyWageBatch(resData.Data.BizID);
            clearInterval(view.schedulerID);
            view.schedulerID = setInterval(() => {
                this.getResutltGenerateMonthlyWageBatch(resData.Data.BizID);
            }, 2000);

        } catch (err) {
            view.showSpin = false;
            message.error(err.message);
            console.log(err);
        }
    }

    @action
    getResutltGenerateMonthlyWageBatch = async (BizID) => {
        let view = this.view;
        let { searchValue: { EnterpriseID, LaborID } } = view;
        let reqParam = { BizID, EnterpriseID, LaborID };

        try {
            let resData = await getResutltGenerateMonthlyWageBatch(reqParam);
            const { State, TaskCode, TaskDesc } = resData.Data;

            if (State == 2) {
                //  停止轮询
                clearInterval(view.schedulerID);
                view.showSpin = false;
                if (TaskCode == 0) {
                    message.success('生成账单成功');

                    view.tableInfo.dataList = [];
                    view.tableInfo.dataListShow = [];
                    view.tableVisible = false;
                    //  重置加入对账单select
                    view.selectJoinState = '0';
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
                view.showSpin = false;
            }
        } catch (err) {
            //  停止轮询
            clearInterval(view.schedulerID);
            view.showSpin = false;
            message.error(err.message);
            console.log(err);
        }
    }

    //  初始化第一个中介（有即选中）
    @action
    initFirstAgent = () => {
        let agents = this.agentList;
        if (agents.length > 0) {
            let agentID = agents[0][0];
            this.view.selectAgentID = agentID;
            this.switchAgent(agentID);
        }
    }

    @action
    resetTableInfo = () => {
        this.view.tableInfo = {
            dataList: [],
            dataListShow: [],
            loading: false
        };
        this.view.tableVisible = false;
        this.view.selectAgentID = -1;
        this.view.selectJoinState = '0';
    }

    @action
    hanleJoinBatchState = (state) => {
        this.view.tableInfo = {
            ...this.view.tableInfo,
            filterInfo: {
                Join: (state == 0) ? ([1, 2]) : (state == 1 ? [1] : [2])
            }
        };
        this.view.selectJoinState = state;
        window._czc.push(['_trackEvent', '导入月薪', '加入对账单', '导入月薪_Y结算']);
    }

    @computed
    get getFormatErrData() {
        const agentMap = this.agentClassify;
        const noAgentData = agentMap.get(0);
        if (noAgentData) {
            return noAgentData.filter((data) => data.FormatRes == 2);
        }
        return [];
    }

    @action
    exportPreview = async () => {
        let view = this.view;
        let { searchValue: { EnterpriseID, LaborID }, ImportBizID, tableVisible } = view;
        let reqParam = { ImportBizID, EnterpriseID, LaborID };

        if (!tableVisible) {
            message.info('请先导入预览');
            return;
        }

        try {
            let resData = await exportPreview(reqParam);
            window.open(resData.Data.FileUrl);
        } catch (err) {
            message.error(err.message);
            console.log(err);
        }
    }
}