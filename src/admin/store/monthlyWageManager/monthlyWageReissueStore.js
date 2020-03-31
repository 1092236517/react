import { observable, action } from "mobx";
import { message } from 'antd';
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { generateMonthlyWageBatch, getResutltGenerateMonthlyWageBatch, impPreview, getResultImportMonthlyWageCheck, getResultFromAliyun, expPreview, getUerInfoById } from 'ADMIN_SERVICE/ZXX_MonthBillGen';
import { safeMul, safeDiv } from 'ADMIN_UTILS/math';
import { tableMoneyRender } from 'ADMIN_UTILS/tableItemRender';
import moment from 'moment';
import { toJS } from 'mobx';
export class View extends BaseView {
    @observable searchValue = {
        Month: undefined,
        EnterpriseID: undefined,
        LaborID: undefined,
        SalaryType: undefined,
        ImportFile: [],
        SheetName: 'sheet1'
    }


    @observable tableInfo = {
        dataList: [],
        loading: false
    };

    @observable tableVisible = false;
    //  前台轮询查询后台结果，id
    @observable schedulerID = '';
    @observable fromJump = false;
    @observable operType = 'single';
}

export default class extends BaseViewStore {
    @action
    showNewTable = (values) => {
        const view = this.view;
        view.searchValue = {
            ...view.searchValue,
            ...values
        };
        view.tableVisible = true;
        view.tableInfo = {
            dataList: [],
            loading: false
        };
    }

    @action
    resetOldTable = () => {
        const view = this.view;
        view.tableVisible = false;
        view.tableInfo = {
            dataList: [],
            loading: false
        };
        view.searchValue = {
            ...view.searchValue,
            ImportFile: [],
            SheetName: 'sheet1'
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
            searchValue: { EnterpriseID, LaborID, Month, SalaryType },
            tableInfo: { dataList }
        } = view;

        if (dataList.length == 0) {
            message.info('请先添加数据！');
            return;
        }

        let agentMap = new Map();
        dataList.forEach((agentInfo) => {
            //  map分组
            let { AgentID, WorkState, EntryDate, LeaveDate, CloseMonth, WorkHours } = agentInfo;
            if (!agentMap.has(AgentID)) {
                agentMap.set(AgentID, []);
            }
            if (AgentID == 0) {
                agentInfo.AgentName = '没有中介';
            }

            agentMap.get(AgentID).push({
                ...agentInfo,
                Amount: safeMul(agentInfo.Amount, 100),
                WorkState,
                EntryDate: EntryDate.format('YYYY-MM-DD'),
                LeaveDate: LeaveDate ? LeaveDate.format('YYYY-MM-DD') : '',
                CloseMonth: CloseMonth ? CloseMonth.format('YYYY-MM') : '',
                WorkHours: WorkHours ? safeMul(WorkHours, 100) : -1
            });
        });

        let BatchList = [];

        agentMap.forEach((value, key) => {
            let NameList = [];
            value.forEach((agentInfo) => {
                NameList.push({ ...agentInfo, FormatRes: agentInfo.FormatRes || 1 });
            });

            BatchList.push({
                NameList
            });
        });

        let reqParam = {
            EnterpriseID: EnterpriseID || -9999,
            FileMd5: '',
            FileName: '',
            LaborID: LaborID || -9999,
            OPType: 2,
            Month: Month ? Month.format('YYYY-MM') : '',
            BatchList,
            SalaryType
        };

        try {
            let resData = await generateMonthlyWageBatch(reqParam);

            this.getResutltGenerateMonthlyWageBatch(resData.Data.BizID);
            clearInterval(view.schedulerID);
            view.schedulerID = setInterval(() => {
                this.getResutltGenerateMonthlyWageBatch(resData.Data.BizID);
            }, 2000);
        } catch (err) {
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
    setFromJump = (state) => {
        this.view.fromJump = state;
    }

    @action
    setImportFile = (id, list) => {
        if (id == 'ImportFile') {
            this.view.searchValue = {
                ...this.view.searchValue,
                ImportFile: [...list]
            };
        }
    }

    @action
    handleFormValuesChange = (changedValues) => {
        //  只检测sheet，发薪月份、企业、劳务、月薪类型在生成表格时已保存
        if (changedValues.SheetName) {
            this.view.searchValue = {
                ...this.view.searchValue,
                ...changedValues
            };
        }
    }

    @action
    impPreview = async () => {
        const view = this.view;
        const { ImportFile, Month } = view.searchValue;
        if (view.searchValue.ImportFile.length == 0) {
            message.info('请上传文件！');
            return;
        }
        let reqParam = {
            ...view.searchValue,
            BucketKey: ImportFile[0].response.bucket,
            FileName: ImportFile[0].response.name.substr(1),
            Month: Month ? Month.format('YYYY-MM') : ''
        };
        delete reqParam.ImportFile;

        try {
            const resData = await impPreview(reqParam);
            const { BizID } = resData.Data;
            view.ImportBizID = BizID;
            this.getResultImportMonthlyWageCheck();
            clearInterval(view.schedulerID);
            view.schedulerID = setInterval(() => {
                this.getResultImportMonthlyWageCheck();
            }, 2000);
        } catch (err) {
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
                const { TaskCode, TaskDesc, RecordList = [] } = aliRes.Data;

                //  停止轮询
                clearInterval(view.schedulerID);
                view.tableInfo.loading = false;
                if (TaskCode == 0) {
                    const newRecord = RecordList.map((item, index) => {
                        const { Amount, CloseMonth, LeaveDate, EntryDate, WorkHours } = item;
                        return {
                            ...item,
                            RecordID: index,
                            Amount: safeDiv(Amount, 100),
                            Amount2: tableMoneyRender(Amount),
                            CloseMonth: CloseMonth ? moment(CloseMonth) : undefined,
                            EntryDate: EntryDate ? moment(EntryDate) : undefined,
                            LeaveDate: LeaveDate ? moment(LeaveDate) : undefined,
                            WorkHours: WorkHours == -1 ? undefined : safeDiv(WorkHours, 100)
                        };
                    });
                    view.tableInfo.dataList = newRecord;
                } else {
                    //  完成，但是失败
                    message.error(TaskDesc);
                }
            } else if (State == 1) {
                //  任务还在进行中
                message.loading('正在执行导入');
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

    @action
    expPreview = async () => {
        const view = this.view;
        if (!view.ImportBizID) {
            message.info('请先导入预览！');
            return;
        }
        const { LaborID, EnterpriseID } = view.searchValue;
        try {
            let reqParam = {
                EnterpriseID,
                ImportBizID: view.ImportBizID,
                LaborID
            };
            let resData = await expPreview(reqParam);
            window.open(resData.Data.FileUrl);
            view.ImportBizID = '';
        } catch (err) {
            message.error(err.message);
            console.log(err);
        }
    }
    @action
    searchByIdInput = async (e) => {
        console.log(e.target.value);
        const { EnterpriseID, LaborID } = this.view.searchValue;
        let param = {
            EnterID: EnterpriseID, IDCardNum: e.target.value, LaborID: LaborID
        };
        await getUerInfoById(param);
        // const view = this.view;
        // if (!view.ImportBizID) {
        //     message.info('请先导入预览！');
        //     return;
        // }
        // const { LaborID, EnterpriseID } = view.searchValue;
        // try {
        //     let reqParam = {
        //         EnterpriseID,
        //         ImportBizID: view.ImportBizID,
        //         LaborID
        //     };
        //     let resData = await expPreview(reqParam);
        //     window.open(resData.Data.FileUrl);
        //     view.ImportBizID = '';
        // } catch (err) {
        //     message.error(err.message);
        //     console.log(err);
        // }
    }


    @action
    updataForSixType = async (record, ayNumber) => {
        const { dataList } = this.view.tableInfo;
        console.log(toJS(dataList));
        let recordInfoList = toJS(dataList).filter((value) => {
            return value.Number !== ayNumber;
        });
        recordInfoList.push(record);
        this.view.tableInfo.dataList = recordInfoList;
    }
    @action
    switchOperTypeStore = (type) => {
        this.view.operType = type;
    }
}