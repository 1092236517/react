import { observable, action, computed } from "mobx";
import { message } from 'antd';
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { Generate, exportPreview, ImportCheck } from 'ADMIN_SERVICE/ZXX_ChatAnalysis';
import moment from 'moment';

export class View extends BaseView {
    @observable searchValue = {
        SheetName: 'sheet1',
        EnterpriseID: undefined,
        LaborID: undefined,
        SettleBeginDate: moment().subtract(moment().day() + 7, 'days'),
        SettleEndDate: moment().subtract(moment().day() - 6 + 7, 'days')
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
    setImportFile = (id, list) => {
        if (id == 'ImportFile') {
            this.view.importFile = [...list];
            this.view.ImportBizID = '';
        }
    }

    @action
    importPreview = async () => {
        const view = this.view;
        const {
            importFile
        } = view;

        view.tableInfo.loading = true;

        let reqParam = {
            BucketKey: importFile[0].response.bucket,
            FileName: importFile[0].response.name.substr(1),
            OriginFileName: importFile[0].originFileObj.name
        };
        try {
            view.tableVisible = true;
            let resData = await ImportCheck(reqParam);
            view.ImportBizID = resData.Data.BizID;
            view.tableInfo = {
                dataListShow: resData.Data.RecordList
            };
            view.tableInfo.loading = false;
        } catch (err) {
            view.tableInfo.loading = false;
            view.ImportBizID = '';
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
    @action
    saveExcelData = async () => {
        try {
            if (this.view.ImportBizID === '') {
                message.info('请先导入预览');
                return;
            } else {
                await Generate({ ImportBizID: this.view.ImportBizID });
                message.info('导入成功');
                this.view.tableVisible = false;
                this.view.ImportBizID = '';
            }

        } catch (err) {
            // message.error(err.message);
            // console.log(err);
        }
    }
}