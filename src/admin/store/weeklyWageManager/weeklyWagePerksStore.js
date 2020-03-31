import { observable, action } from "mobx";
import { message } from 'antd';
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { importWeeklyPerksCheck, getSbsidyGetImportResult, exportPreview } from 'ADMIN_SERVICE/ZXX_WeekPerks';

export class View extends BaseView {
    @observable searchValue = {
        SheetName: 'sheet1',
        EnterpriseID: undefined,
        LaborID: undefined,
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
                LaborID
            },
            importFile
        } = view;

        view.tableInfo.loading = true;

        let reqParam = {
            SheetName,
            BucketKey: importFile[0].response.bucket,
            EnterpriseID,
            FileName: importFile[0].response.name.substr(1),
            LaborID
        };

        try {
            view.tableVisible = true;
            let resData = await importWeeklyPerksCheck(reqParam);
            const { BizID } = resData.Data;
            view.ImportBizID = BizID;
            this.getResultImportWeeklyPerksCheck();
            clearInterval(view.schedulerID);
            view.schedulerID = setInterval(() => {
                this.getResultImportWeeklyPerksCheck();
            }, 2000);

        } catch (err) {
            view.tableInfo.loading = false;
            message.error(err.message);
            console.log(err);
        }
    }

    @action
    getResultImportWeeklyPerksCheck = async () => {
        let view = this.view;
        let reqParam = { BizID: view.ImportBizID };
        try {
            let resData = await getSbsidyGetImportResult(reqParam);
            const { State, RecordList, TaskCode, TaskDesc } = resData.Data;

            if (State == 2) {
                //  停止轮询
                clearInterval(view.schedulerID);
                view.tableInfo.loading = false;
                if (TaskCode == 0) {
                    view.tableInfo = {
                        dataListShow: RecordList || []
                    };
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
    exportPreview = async () => {
        let view = this.view;
        let { searchValue: { EnterpriseID, LaborID }, ImportBizID, tableVisible } = view;
        let reqParam = { BizID: ImportBizID };

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