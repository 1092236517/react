import { BaseView, BaseViewStore } from 'ADMIN/store/BaseViewStore';
import { GetStatics, ExportStatics, ModifyLeak } from 'ADMIN_SERVICE/ZXX_XManager';
import { message } from 'antd';
import { action, observable } from 'mobx';
export class View extends BaseView {
    @observable searchValue = { 
        BeginMonth: null,
        EndMonth: null,
        LaborID: null, // 劳务ID
        EnterpriseID: null // 企业ID
    };

    @observable RecordList = [];
    @observable pagination = {
        current: 1,
        pageSize: 10
    }
    @observable totalNum = 0;
    @observable FormListStatus = 'close';
}
export default class extends BaseViewStore {
    // 获取X查漏
    @action
    getStatics = async () => {
        let view = this.view;
        view.RecordList = [];
        view.FormListStatus = 'pending';
        const { current, pageSize } = view.pagination;
        const { BeginMonth, EndMonth, EnterpriseID, LaborID } = view.searchValue;
        let query = {
            BeginMonth: BeginMonth ? BeginMonth.format('YYYY-MM') : "",
            EndMonth: EndMonth ? EndMonth.format('YYYY-MM') : "",
            EnterpriseID: EnterpriseID ? EnterpriseID * 1 : -9999,
            LaborID: LaborID ? LaborID * 1 : -9999,
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };
        try {
            let res = await GetStatics(query);
            let Data = res.Data;
            view.FormListStatus = 'done';
            view.RecordList = Data.RecordList || [];
            view.totalNum = Data.RecordCount;
            view.EnterpriseName = Data.EnterpriseName;
            view.LaborName = Data.LaborName;
            view.BeginMonth = Data.BeginMonth;
            return Data;
        } catch (error) {
            view.FormListStatus = 'error';
            message.error(error.message);
            console.log(error);
        }
    }

    // 导出X查漏 
    @action
    exportStatics = async () => {
        let view = this.view;
        view.RecordList = [];
        view.FormListStatus = 'pending';
        const { BeginMonth, EndMonth, EnterpriseID, LaborID } = view.searchValue;
        let query = {
            BeginMonth: BeginMonth ? BeginMonth.format('YYYY-MM') : "",
            EndMonth: EndMonth ? EndMonth.format('YYYY-MM') : "",
            EnterpriseID: EnterpriseID ? EnterpriseID * 1 : -9999,
            LaborID: LaborID ? LaborID * 1 : -9999
        };
        try {
            let res = await ExportStatics(query);
            let Data = res.Data;
            view.FormListStatus = 'done';
            message.success("导出成功！");
            this.getStatics();
            return Data;
        } catch (error) {
            view.FormListStatus = 'error';
            message.error(error.message);
            console.log(error);
        }
    }
    // 修改缺 
    @action
    saveData = async(RecordID, XType, Remark) => {
        let view = this.view;
        view.FormListStatus = 'pending';
        let query = {
            RecordID,
            XType,
            Remark
        };
        try {
            let res = await ModifyLeak(query);
            let Data = res.Data;
            view.FormListStatus = 'done';
            this.getStatics();
            message.success("修改成功！");
            return Data;
        } catch (error) {
            view.FormListStatus = 'error';
            message.error(error.message);
            console.log(error);
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
        this.getStatics();
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