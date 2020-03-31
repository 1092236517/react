import { observable, action } from "mobx";
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { message } from 'antd';
import { checkImpX, getAvaliableXTypes, exportImpXPre, generateBatchImpX, getResCheckImpX, getResGeneBatch } from 'ADMIN_SERVICE/ZXX_XManager';
export class View extends BaseView {
    @observable searchValue = {
        SheetName: 'sheet1',
        LaborID: undefined,
        EnterpriseID: undefined,
        Month: undefined,
        XType: undefined,
        ImportFile: []
    }

    @observable tableInfo = {
        dataList: [],
        loading: false
    };

    @observable canUseXType = [];
    //  前台轮询查询后台结果，id
    @observable schedulerID = '';
    @observable lastScheFinish = true;
    //  导入任务操作ID
    @observable ImportBizID = '';
    //  提交保存操作ID
    @observable GeneBizID = '';

}

export default class extends BaseViewStore {
    @action
    importPreview = async () => {
        const view = this.view;
        const {
            searchValue: {
                SheetName, LaborID, EnterpriseID, Month, XType, ImportFile
            }
        } = view;

        let reqParam = {
            SheetName,
            BucketKey: ImportFile[0].response.bucket,
            EnterpriseID,
            FileName: ImportFile[0].response.name.substr(1),
            ImportType: 1,
            LaborID,
            Month: Month.format('YYYY-MM'),
            XType
        };

        try {
            view.tableInfo.loading = true;
            let resData = await checkImpX(reqParam);

            const { Data: { BizID } } = resData;
            view.ImportBizID = BizID;
            this.getResCheckImpX();
            clearInterval(view.schedulerID);
            view.schedulerID = setInterval(() => {
                view.lastScheFinish && this.getResCheckImpX();
            }, 2000);
        } catch (err) {
            view.tableInfo.loading = false;
            message.error(err.message);
            console.log(err);
        }
    }

    @action
    getResCheckImpX = async () => {
        const view = this.view;
        view.lastScheFinish = false;
        try {
            let reqParam = { BizID: view.ImportBizID };
            let resData = await getResCheckImpX(reqParam);
            view.lastScheFinish = true;
            const { Data: { RecordList, State, TaskCode, TaskDesc } } = resData;

            if (State == 2) {
                //  停止轮询
                clearInterval(view.schedulerID);
                view.tableInfo.loading = false;
                if (TaskCode == 0) {
                    message.success('导入成功！');
                    view.tableInfo.dataList = RecordList || [];
                } else {
                    //  完成，但是失败
                    message.error(TaskDesc);
                    view.tableInfo.dataList = [];
                }
            } else if (State == 1) {
                //  任务还在进行中
                message.loading('正在导入...');
            } else {
                //  任务超时
                message.error('导入超时，请稍后再试！');
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
    exportImpXPre = async () => {
        const { ImportBizID } = this.view;
        if (!ImportBizID) {
            message.info('请先导入预览！');
            return;
        }

        let reqParam = {
            ImportBizID,
            ImportType: 1
        };

        try {
            let resData = await exportImpXPre(reqParam);
            const { Data: { FileUrl } } = resData;
            window.open(FileUrl);
        } catch (err) {
            message.error(err.message);
            console.log(err);
        }
    }

    @action
    generateBatchImpX = async () => {
        const view = this.view;
        const { searchValue: { EnterpriseID, LaborID, Month, XType }, ImportBizID } = view;
        if (!ImportBizID) {
            message.info('请先导入预览！');
            return;
        }

        let reqParam = {
            EnterpriseID,
            ImportBizID,
            LaborID,
            Month: Month.format('YYYY-MM'),
            XType
        };

        try {
            let resData = await generateBatchImpX(reqParam);
            const { Data: { BizID } } = resData;
            view.GeneBizID = BizID;
            this.getResGeneBatch();
            clearInterval(view.schedulerID);
            view.schedulerID = setInterval(() => {
                this.getResGeneBatch();
            }, 2000);
        } catch (err) {
            message.error(err.message);
            console.log(err);
        }
    }

    @action
    getResGeneBatch = async () => {
        const view = this.view;
        try {
            let reqParam = {
                BizID: view.GeneBizID
            };

            let resData = await getResGeneBatch(reqParam);
            const { Data: { State, TaskCode, TaskDesc } } = resData;

            if (State == 2) {
                //  停止轮询
                clearInterval(view.schedulerID);
                if (TaskCode == 0) {
                    message.success('提交成功！');
                    view.ImportBizID = '';
                    view.tableInfo.dataList = [];
                } else {
                    //  完成，但是失败
                    message.error(TaskDesc);
                }
            } else if (State == 1) {
                //  任务还在进行中
                message.loading('正在提交');
            } else {
                //  任务超时
                message.error('提交超时！请稍后再试！');
                clearInterval(view.schedulerID);
            }
        } catch (err) {
            message.error(err.message);
            console.log(err);
        }
    }

    @action
    handleFormValuesChange = async (changedValues, allValues) => {
        const { searchValue } = this.view;
        this.view.searchValue = {
            ...searchValue,
            ...changedValues
        };
        const { EnterpriseID, LaborID } = allValues;
        if (LaborID && EnterpriseID && ['EnterpriseID', 'LaborID'].includes(Object.keys(changedValues)[0])) {
            try {
                let resData = await getAvaliableXTypes({
                    EnterpriseID,
                    LaborID
                });
                //  获取xType
                this.view.canUseXType = resData.Data.RecordList;
            } catch (err) {
                message.error(err.message);
                console.log(err);
            }
        }
    }

    @action
    resetForm = () => {
        this.view.resetProperty('searchValue');
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
}