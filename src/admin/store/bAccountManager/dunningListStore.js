import { BaseView, BaseViewStore } from 'ADMIN/store/BaseViewStore';
import { GetDunningList, ExportDunningList } from 'ADMIN_SERVICE/ZXX_FundAduj';
import { message } from 'antd';
import { action, observable } from 'mobx';

export class View extends BaseView {
    @observable searchValue = { // 催款列表查询
        BeginDate: null,
        EndDate: null,
        SpId: null, // 劳务ID
        EntId: null // 企业ID
    };
    @observable RecordList = [];
    @observable pagination = {
        current: 1,
        pageSize: 10
    }
    @observable totalNum = 0; // 总条数
    @observable FormListStatus = 'close';
}

export default class extends BaseViewStore {
    // 获取催款列表
    @action
    getDunningList = async () =>{
        let view = this.view;
        view.RecordList = [];
        view.FormListStatus = 'pending';
        const { current, pageSize } = view.pagination;
        const { BeginDate, EndDate, SpId, EntId } = view.searchValue;

        let query = {
            SpId: SpId ? SpId * 1 : -9999, 
            EntId: EntId ? EntId * 1 : -9999,
            BeginDate: BeginDate ? BeginDate.format('YYYY-MM') : "",
            EndDate: EndDate ? EndDate.format('YYYY-MM') : "",
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };

        try {
            let res = await GetDunningList(query);
            let Data = res.Data;
            view.FormListStatus = 'done';
            view.RecordList = (Data.RecordList || []).map((item, primaryIndex) => ({...item, primaryIndex}));
            view.totalNum = Data.RecordCount;
            return Data;
        } catch(error) {
            view.FormListStatus = 'error';
            message.error(error.message);
            console.log(error);
        }
    }

    // 导出
    @action
    exportDunningList = async () => {
        let view = this.view;
        view.RecordList = [];
        view.FormListStatus = 'pending';
        const { BeginDate, EndDate, SpId, EntId } = view.searchValue;

        let query = {
            SpId: SpId ? SpId * 1 : -9999, 
            EntId: EntId ? EntId * 1 : -9999,
            BeginDate: BeginDate ? BeginDate.format('YYYY-MM') : "",
            EndDate: EndDate ? EndDate.format('YYYY-MM') : ""
        };

        try {
            let res = await ExportDunningList(query);
            let Data = res.Data;
            view.FormListStatus = 'done';
            this.getDunningList();
            return Data;
        } catch(error) {
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
        this.getDunningList();
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
