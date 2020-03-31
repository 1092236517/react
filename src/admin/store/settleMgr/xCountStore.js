import { BaseView, BaseViewStore } from 'ADMIN/store/BaseViewStore';
import { GetXSummary, ModifyXSummary, AuditXSummary } from 'ADMIN_SERVICE/ZXX_XManager';
import { message } from 'antd';
import { action, observable } from 'mobx';
import { safeMul } from 'ADMIN_UTILS/math';

export class View extends BaseView {
    @observable searchValue = { 
        BeginDt: null,
        EndDt: null,
        TrgtSpId: "", // 劳务ID
        EntId: "" // 企业ID
    };

    @observable importX = null;
    @observable lastX = null;
    @observable endResult = null;

    @observable RecordList = [];
    @observable pagination = {
        current: 1,
        pageSize: 10
    }
    @observable totalNum = 0;
    @observable selectedRowKeys = [];
    @observable FormListStatus = 'close';
}
export default class extends BaseViewStore {
    // 获取x汇总表
    @action
    getXSummary = async () => {
        let view = this.view;
        view.RecordList = [];
        view.FormListStatus = 'pending';
        const { current, pageSize } = view.pagination;
        const { BeginDt, EndDt, TrgtSpId, EntId } = view.searchValue;
        let query = {
            TrgtSpId: TrgtSpId ? TrgtSpId * 1 : -9999,
            EntId: EntId ? EntId * 1 : -9999,
            BeginDt: BeginDt ? BeginDt.format('YYYY-MM') : "",
            EndDt: EndDt ? EndDt.format('YYYY-MM') : "",
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };
        try {
            let res = await GetXSummary(query);
            let Data = res.Data;
            view.FormListStatus = 'done';
            view.RecordList = (Data.RecordList || []).map((item, RecordID) => ({...item, RecordID}));
            view.totalNum = Data.RecordCount;
            view.selectedRowKeys = [];
            return Data;
        } catch (error) {
            view.FormListStatus = 'error';
            message.error(error.message);
            console.log(error);
        }
    }

    // 导出x汇总表
    // @action
    // exportX = async () => {
    //     let view = this.view;
    //     view.RecordList = [];
    //     view.FormListStatus = 'pending';
    //     const { BeginDt, EndDt, TrgtSpId, EntId } = view.searchValue;
    //     let query = {
    //         TrgtSpId: TrgtSpId ? TrgtSpId * 1 : -9999,
    //         EntId: EntId ? EntId * 1 : -9999,
    //         BeginDt: BeginDt ? BeginDt.format('YYYY-MM') : "",
    //         EndDt: EndDt ? EndDt.format('YYYY-MM') : ""
    //     };
        
    //     try {
    //         let res = await GetXSummary(query);
    //         let Data = res.Data;
    //         view.FormListStatus = 'done';
    //         message.success("导出成功！");
    //         return Data;
    //     } catch (error) {
    //         view.FormListStatus = 'error';
    //         message.error(error.message);
    //         console.log(error);
    //     }
    // }


    //  设置分页
    @action
    setPagination = (current, pageSize) => {
        let view = this.view;
        view.pagination = {
            current,
            pageSize
        };
        this.getXSummary();
    }

    @action
    resetPageCurrent = () => {
        let view = this.view;
        view.pagination = {
            ...view.pagination,
            current: 1
        };
    }

    // 表格选中的行
    @action
    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.view.selectedRowKeys = selectedRowKeys;
    }

    // 判断时否有选中的记录-审核
    line = async(AuditSts) => {
        let view = this.view;
        view.FormListStatus = 'padding';
        let Ids = [];
        view.selectedRowKeys.map((item, index) => {
            Ids[index] = {
                EntId: view.RecordList[item].EntId,
                TrgtSpId: view.RecordList[item].TrgtSpId,
                RelatedMo: view.RecordList[item].RelatedMo
            };
        });
        let query = {
            AuditSts: AuditSts, 
            Ids: Ids
        };
        if (view.selectedRowKeys.length === 0) {
            message.warn('请选择要审核的记录');
        } else {
            try {
                view.FormListStatus = 'done';
                let res = await AuditXSummary(query);
                let Data = res.Data;
                message.success("审核成功");
                this.getXSummary();
                view.selectedRowKeys = [];
                return Data;
            } catch (error) {
                view.FormListStatus = 'error';
                message.error(error.message);
                console.log(error);
            }
        }
    }

    // 修改X
    @action
    saveData = async(RelatedMo, EntId, TrgtSpId, ModifyRemark, EndXmoney) => {
        let view = this.view;
        view.FormListStatus = 'pending';
        let query = { 
            RelatedMo: RelatedMo,
            EntId: EntId,
            TrgtSpId: TrgtSpId,
            ModifyRemark: ModifyRemark,
            EndXmoney: safeMul(EndXmoney, 100)
        };
        try {
            view.FormListStatus = 'done';
            let res = await ModifyXSummary(query);
            let Data = res.Data;
            message.success("修改成功！");
            this.getXSummary();
            return Data;
        } catch (error) {
            view.FormListStatus = 'error';
            message.error(error.message);
            console.log(error);
        }
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