import {observable, action} from "mobx";
import {BaseView, BaseViewStore} from "../BaseViewStore";
import {message} from 'antd';
import {getAgentLaborList, editAgentLabor, syncAgentLabor} from 'ADMIN_SERVICE/ZXX_BaseData';

export class View extends BaseView {
    @observable searchValue = {
        BankAccountName: '',
        BankCardNo: '',
        BankName: undefined,
        CtctMobile: '',
        CtctPeople: '',
        InfoIsCompleted: -9999,
        SpId: undefined,
        SpShortName: ''
    };
    @observable page = {
        RecordIndex: 1,
        RecordSize: 10
    };
    @observable RecordCount = 0;
    // 打卡记录列表
    @observable dataSource = [];
    @observable recordDataSource = {};
    @observable loading = false;
    @observable editVisible = false;
    @observable syncVisible = false;
    @observable modalLoading = false;
}

export default class extends BaseViewStore {
    @action
    getList = async(param) => {
        this.view.loading = true;
        param ? (this.view.page = param) : (this.view.page = {RecordIndex: 1, RecordSize: this.view.page.RecordSize});
        let page = {RecordIndex: (this.view.page.RecordIndex - 1) * this.view.page.RecordSize, RecordSize: this.view.page.RecordSize};
        const searchValue = {...{}, ...this.view.searchValue};
        for (let key in searchValue) {
            !searchValue[key] && delete searchValue[key];
        }
        try {
            const res = await getAgentLaborList({...{...searchValue, ...page}, SpTyp: 2});
            this.view.dataSource = res.Data.RecordList || [];
            this.view.RecordCount = res.Data.RecordCount;
        } catch(err) {
            message.error(err.Desc || '获取失败');
            this.view.dataSource = [];
            this.view.RecordCount = 0;
            this.view.page = {
                RecordIndex: 0,
                RecordSize: 10
            };
        }
        this.view.loading = false;
    }

    // 保存
    handleSave = async(values) => {
        this.view.modalLoading = true;
        try {
            await editAgentLabor(values);
            message.success('修改成功');
            this.setVisible('editVisible', false);
            this.getList({RecordIndex: this.view.page.RecordIndex, RecordSize: this.view.page.RecordSize});
        } catch (err) {
            message.error(err.Desc || '修改失败');
        }
        this.view.modalLoading = false;
    }

    // 同步数据
    @action
    syncAgentLabor= async(e) => {
		e.preventDefault();
        this.view.modalLoading = true;
        window._czc.push(['_trackEvent', '劳务基础数据', '确定同步', '劳务基础数据_N非结算']);
        try {
            await syncAgentLabor({SpTyp: 2});
            message.success('同步成功');
            this.handleFormReset();
            this.getList();
        } catch (err) {
            message.error(err.Desc || '同步失败');
        }
        this.setVisible('syncVisible', false);
        this.view.modalLoading = false;
    }

    @action
    setRecord = (record) => {
        this.view.modalLoading = true;
        this.view.recordDataSource = record;
        this.setVisible('editVisible', true);
        this.view.modalLoading = false;
    }

    // 设置弹窗的显示和隐藏
    @action
    setVisible = (visible, flag) => {
        this.view[visible] = flag;
    }

    @action
    handleFormValuesChange = (values) => {
        this.view.searchValue = values;
    };

    @action
    handleFormReset = () => {
        this.view.resetProperty('searchValue');
    };

}