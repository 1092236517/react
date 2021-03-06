import { observable, action, computed } from "mobx";
import { message } from 'antd';
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { importWeeklyWageCheck, generateWeeklyWageBatchByBiz, getResultImportWeeklyWageCheck, getResultgenerateWeeklyWageBatch, getResultFromAliyun, exportPreview } from 'ADMIN_SERVICE/ZXX_WeekBillGen';
import moment from 'moment';

export class View extends BaseView {
    @observable searchValue = {
        SheetName: 'sheet1',
        EnterpriseID: undefined,
        LaborID: undefined,
        SettleBeginDate: moment().subtract(moment().day() + 7, 'days'),
        SettleEndDate: moment().subtract(moment().day() - 6 + 7, 'days'),
        WeekSalaryType: 1
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
                SettleBeginDate,
                SettleEndDate,
                WeekSalaryType
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
            SettleBeginDate: SettleBeginDate.format('YYYY-MM-DD'),
            SettleEndDate: SettleEndDate.format('YYYY-MM-DD'),
            WeekSalaryType: WeekSalaryType || 1
        };

        try {
            view.tableVisible = true;
            let resData = await importWeeklyWageCheck(reqParam);
            view.ImportBizID = resData.Data.BizID;
            this.getResultImportWeeklyWageCheck();
            clearInterval(view.schedulerID);
            view.schedulerID = setInterval(() => {
                this.getResultImportWeeklyWageCheck();
            }, 2000);

        } catch (err) {
            view.tableInfo.loading = false;
            message.error(err.message);
            console.log(err);
        }
    }

    @action
    getResultImportWeeklyWageCheck = async () => {
        let view = this.view;
        let { searchValue: { EnterpriseID, LaborID } } = view;
        let reqParam = { BizID: view.ImportBizID, EnterpriseID, LaborID };
        try {
            let resData = await getResultImportWeeklyWageCheck(reqParam);
            const { State, ResultUrl } = resData.Data;

            if (State == 2) {
                let aliRes = await getResultFromAliyun(ResultUrl);
                let { TaskCode, TaskDesc, BatchList } = aliRes.Data;
                BatchList = BatchList || [];

                BatchList.forEach((batch) => {
                    batch.NewAgentID = `${batch.AgentID}__${batch.SettleEndDate}`;
                });

                //  停止轮询
                clearInterval(view.schedulerID);
                view.tableInfo.loading = false;
                if (TaskCode == 0) {
                    view.tableInfo = {
                        dataList: BatchList,
                        dataListShow: []
                    };

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

    //  初始化第一个中介（有即选中）
    @action
    initFirstAgent = () => {
        let agents = this.agentList;
        if (agents.length > 0) {
            const { NewAgentID } = agents[0];
            this.view.selectAgentID = NewAgentID;
            this.switchAgent(NewAgentID);
        }
    }

    @computed
    get agentList() {
        const { dataList } = this.view.tableInfo;
        return dataList.map(({ NewAgentID, AgentName }) => ({ NewAgentID, AgentName }));
    }


    @action
    switchAgent = (agentID) => {
        const view = this.view;

        const batchInfo = view.tableInfo.dataList.find((value) => {
            return value.NewAgentID == agentID;
        });

        if (!batchInfo) {
            return;
        }

        view.tableInfo.dataListShow = batchInfo.RecordList;
        view.selectAgentID = agentID;
        //  重置加入对账单select
        view.selectJoinState = '0';
        //  重置筛选条件
        view.tableInfo = {
            ...view.tableInfo,
            filterInfo: {
                Join: [1, 2]
            }
        };
        window._czc.push(['_trackEvent', '导入周薪', 'switchAgent', '导入周薪_Y结算']);
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
                EnterpriseID, LaborID
            },
            tableInfo: {
                dataListShow
            },
            tableVisible,
            ImportBizID
        } = view;

        if (!tableVisible) {
            message.info('请先导入预览');
            return;
        }

        let reqParam = {
            ImportBizID,
            EnterpriseID,
            LaborID
        };

        try {
            view.showSpin = true;
            let resData = await generateWeeklyWageBatchByBiz(reqParam);

            this.getResultgenerateWeeklyWageBatch(resData.Data.BizID);
            clearInterval(view.schedulerID);
            view.schedulerID = setInterval(() => {
                this.getResultgenerateWeeklyWageBatch(resData.Data.BizID);
            }, 2000);

        } catch (err) {
            view.showSpin = false;
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
        const view = this.view;
        view.tableInfo = {
            ...view.tableInfo,
            filterInfo: {
                Join: (state == 0) ? ([1, 2]) : (state == 1 ? [1] : [2])
            }
        };
        view.selectJoinState = state;
        window._czc.push(['_trackEvent', '导入周薪', '加入对账单', '导入周薪_Y结算']);
    }

    @computed
    get getFormatErrData() {
        const { dataList } = this.view.tableInfo;
        const noAgentData = dataList.find((value) => value.AgentID == 0);
        if (noAgentData) {
            return noAgentData.RecordList.filter((data) => data.FormatRes == 2);
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