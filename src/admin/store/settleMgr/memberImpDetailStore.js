import { observable, action } from "mobx";
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { message } from 'antd';
import { checkImpX, exportImpXPre, getResCheckImpX } from 'ADMIN_SERVICE/ZXX_XManager';
export class View extends BaseView {
    @observable searchValue = {
        SheetName: 'sheet1',
        LaborID: null,
        EnterpriseID: null
    }

    @observable tableInfo = {
        dataList: [],
        loading: false
    };

    @observable ImportFile= [];
    //  导入任务操作ID
    @observable ImportBizID = '';
    //  前台轮询查询后台结果，id
    @observable schedulerID = '';
    @observable lastScheFinish = true;
}

export default class extends BaseViewStore {
    @action
    importPreview = async () => {
        const view = this.view;
        view.tableInfo.loading = true;
        const {
            searchValue: {
                SheetName, LaborID, EnterpriseID
            },
            ImportFile
        } = view;
        let reqParam = {
            SheetName,
            ImportType: 2, // 筛选导入
            EnterpriseID: EnterpriseID ? EnterpriseID : -9999,
            LaborID: LaborID ? LaborID : -9999,
            BucketKey: ImportFile[0].response.bucket,
            FileName: ImportFile[0].response.name.substr(1)
        };
        try {
            view.tableInfo.loading = false;
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

    // 导出
    @action
    exportImpXPre = async () => {
        const { ImportBizID } = this.view;
        if (!ImportBizID) {
            message.info('请先导入预览！');
            return;
        }
        let reqParam = {
            ImportBizID,
            ImportType: 2 
        };
        try {
            let resData = await exportImpXPre(reqParam);
            window.open(resData.Data.FileUrl);
        } catch (err) {
            message.error(err.message);
            console.log(err);
        }
    }

    @action
    handleFormValuesChange = (values) => {
        this.view.searchValue = values;
    }

    @action
    resetForm = () => {
        this.view.resetProperty('searchValue');
    }

    @action
    setImportFile = (id, list) => {
        if (id == 'ImportFile') {
            this.view.ImportFile = [...list];
        }
    }
}