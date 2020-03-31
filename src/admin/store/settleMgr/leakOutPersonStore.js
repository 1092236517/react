import { BaseView, BaseViewStore } from 'ADMIN/store/BaseViewStore';
import { GetByPeople, ExportByPeople, exportAllPeople, getExpRes } from 'ADMIN_SERVICE/ZXX_XManager';
import { message } from 'antd';
import { action, observable } from 'mobx';

export class View extends BaseView {
    @observable searchValue = {
        Month: null,
        RealName: '',
        IDCardNum: '',
        LaborID: null, // 劳务ID
        EnterpriseID: null // 企业ID
    };

    @observable EnterpriseName = '';
    @observable LaborName = '';
    @observable Month = null;

    @observable RecordList = [];
    @observable pagination = {
        current: 1,
        pageSize: 10
    }
    @observable totalNum = 0;
    @observable FormListStatus = 'close';
}
export default class extends BaseViewStore {
    // 获取X个人查漏
    @action
    getByPeople = async () => {
        let view = this.view;
        view.RecordList = [];
        view.FormListStatus = 'pending';
        // const { current, pageSize } = view.pagination;
        const { Month, RealName, EnterpriseID, LaborID, IDCardNum } = view.searchValue;
        if (!EnterpriseID) {
            view.FormListStatus = 'done';
            return;
        }
        let query = {
            Month: Month ? Month.format('YYYY-MM') : "",
            RealName: RealName,
            XType: -9999,
            EnterpriseID: EnterpriseID ? EnterpriseID * 1 : -9999,
            LaborID: LaborID ? LaborID * 1 : -9999,
            IDCardNum: IDCardNum
        };
        try {
            let res = await GetByPeople(query);
            let Data = res.Data;
            view.FormListStatus = 'done';
            const EnterpriseName = Data.EnterpriseName;
            const LaborName = Data.LaborName;
            const Month = Data.Month;
            view.RecordList = (Data.RecordList || []).map((item) => ({ ...item, EnterpriseName, LaborName, Month }));
            view.totalNum = Data.RecordList.length;
            return Data;
        } catch (error) {
            view.FormListStatus = 'error';
            message.error(error.message);
            console.log(error);
        }
    }

    // 导出X个人查漏 
    @action
    exportByPeople = async () => {
        let view = this.view;
        view.RecordList = [];
        view.FormListStatus = 'pending';
        const { Month, RealName, EnterpriseID, LaborID, IDCardNum } = view.searchValue;
        let query = {
            Month: Month ? Month.format('YYYY-MM') : "",
            RealName: RealName,
            XType: -9999,
            EnterpriseID: EnterpriseID ? EnterpriseID * 1 : -9999,
            LaborID: LaborID ? LaborID * 1 : -9999,
            IDCardNum: IDCardNum
        };
        try {
            let res = await ExportByPeople(query);
            view.FormListStatus = 'done';
            message.success("导出成功！");
            window.open(res.Data.FileUrl);
        } catch (error) {
            view.FormListStatus = 'error';
            message.error(error.message);
            console.log(error);
        }
    }

    @action
    exportAllPeople = async () => {
        const view = this.view;
        const { Month } = view.searchValue;
        if (!Month) {
            return message.info('请选择月份！');
        }

        const reqParam = {
            Month: Month.format('YYYY-MM')
        };

        try {
            const res = await exportAllPeople(reqParam);
            const { BizID } = res.Data;
            this.getExpRes(BizID);
            this.schedulerID = setInterval(() => {
                this.getExpRes(BizID);
            }, 2000);
        } catch (err) {
            message.error(err.message);
            console.error(err);
        }
    }

    getExpRes = async (BizID) => {
        let reqParam = { BizID };
        try {
            let resData = await getExpRes(reqParam);
            const { State, FileUrl, TaskCode, TaskDesc } = resData.Data;

            if (State == 0) {
                //    未完成
                message.loading('正在导出记录请稍候！');
            } else {
                //  已完成
                window.clearInterval(this.schedulerID);
                this.schedulerID = '';
                if (TaskCode == 0) {
                    window.open(FileUrl);
                } else {
                    message.error(TaskDesc);
                }
            }
        } catch (err) {
            window.clearInterval(this.schedulerID);
            this.schedulerID = '';
            message.error(err.message);
            console.log(err);
        }
    }

    //  设置分页
    @action
    setPagination = (current, pageSize) => {
        let view = this.view;
        view.pagination = {
            current,
            pageSize
        };
        this.getByPeople();
    }

    @action
    resetPageCurrent = () => {
        let view = this.view;
        view.pagination = {
            ...view.pagination,
            current: 1
        };
    }

    @action
    handleFormValuesChange = (values) => {
        this.view.searchValue = values;
    }

    @action
    handleFormReset = () => {
        this.view.resetProperty('searchValue');
    }

}