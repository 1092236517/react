import { observable, action, computed, toJS } from "mobx";
import { message, Modal } from 'antd';
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { ImportPreview, Save, PreviewExport } from 'ADMIN_SERVICE/ZXX_MonthBillGen';

export class View extends BaseView {
    @observable searchValue = {
        SheetName: 'sheet1',
        EntId: undefined,
        TrgtSpId: undefined,
        Month: undefined
    }
    @observable IdCardNumList: []; // 提交保存时的身份证列表
    @observable tableInfo = {
        //  当前显示的数据
        dataListShow: [],
        loading: false,
        //  表格筛选条件
        filterInfo: null
    };

    @observable selectedRowKeys = [];
    @observable importFile = [];
    @observable tableVisible = false;
    @observable showSpin = false;

    @observable DetailsVisible = false;
    @observable modalLoading = false;
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
    // 导入预览
    @action
    importPreview = async () => {
        const view = this.view;
        const {
            searchValue: {
                SheetName,
                EntId,
                TrgtSpId,
                Month
            },
            importFile
        } = view;

        view.tableInfo.loading = true;
        let reqParam = {
            SheetName,
            BucketKey: importFile[0].response.bucket,
            EntId,
            FileName: importFile[0].response.name.substr(1),
            TrgtSpId,
            Month: Month ? Month.format('YYYY-MM') : ''
        };

        try {
            view.tableVisible = true;
            let resData = await ImportPreview(reqParam);
            let Data = resData.Data;
            view.tableInfo.dataListShow = (Data || []).map((item, primaryIndex) => ({ ...item, primaryIndex }));
            view.selectedRowKeys = [];
            view.tableInfo.loading = false;
            return Data;
        } catch (err) {
            view.tableInfo.loading = false;
            message.error(err.message);
            console.log(err);
        }
    }

    // 提交保存
    @action
    save = async () => {
        const view = this.view;
        const {
            searchValue: {
                SheetName,
                EntId,
                TrgtSpId,
                Month
            },
            importFile

        } = view;
        const { tableVisible } = view;

        view.IdCardNumList = view.tableInfo.dataListShow.map(item => {
            return item.IdCardNum;
        });

        if (!tableVisible) {
            message.info('请先导入预览');
            return;
        }

        if (view.IdCardNumList.length === 0) {
            message.info("没有数据可以保存");
            return;
        }

        let reqParam = {
            SheetName,
            BucketKey: importFile[0].response.bucket,
            EntId,
            FileName: importFile[0].response.name.substr(1),
            TrgtSpId,
            Month: Month ? Month.format('YYYY-MM') : '',
            IdCardNumList: toJS(view.IdCardNumList)
        };

        try {
            view.showSpin = true;
            let resData = await Save(reqParam);
            message.success("保存成功");
            view.tableInfo.dataListShow = [];
            view.tableVisible = false;
            view.showSpin = false;
            return resData;
        } catch (err) {
            view.showSpin = false;
            message.error(err.message);
            console.log(err);
        }
    }

    // 导出工资单
    @action
    exportPreview = async () => {
        let view = this.view;
        const {
            searchValue: {
                SheetName,
                EntId,
                TrgtSpId,
                Month
            },
            importFile,
            tableVisible
        } = view;
        view.IdCardNumList = view.tableInfo.dataListShow.map(item => {
            return item.IdCardNum;
        });

        if (!tableVisible) {
            message.info('请先导入预览');
            return;
        }

        if (view.IdCardNumList.length === 0) {
            message.info("身份证数组为空");
            return;
        }
        window._czc.push(['_trackEvent', '工资单导入', '导出工资单', '工资单导入_Y结算']);
        let reqParam = {
            SheetName,
            BucketKey: importFile[0].response.bucket,
            EntId,
            FileName: importFile[0].response.name.substr(1),
            TrgtSpId,
            Month: Month ? Month.format('YYYY-MM') : '',
            IdCardNumList: toJS(view.IdCardNumList)
        };

        try {
            let resData = await PreviewExport(reqParam);
            window.open(resData.Data.FileUrl);
        } catch (err) {
            message.error(err.message);
            console.log(err);
        }
    }

    // 表格选中的行
    @action
    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.view.selectedRowKeys = selectedRowKeys;
    }

    // 判断时否有选中的记录
    line = () => {
        if (this.view.selectedRowKeys.length === 0) {
            message.warn('请选择要删除的记录');
        } else {
            Modal.confirm({
                title: '您确定要删除选择的所有申请吗？',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    this.delete();
                }
            });
        }
    }

    // 删除
    @action
    delete = () => {
        let view = this.view;
        // 从上次的记录里删除这次选中的，然后返回剩余的
        view.tableInfo.dataListShow = view.tableInfo.dataListShow.filter((item, index) => {
            return !view.selectedRowKeys.includes(view.tableInfo.dataListShow[index].primaryIndex);
        });
        view.selectedRowKeys = [];
        console.log("view.tableInfo.dataListShow:", toJS(view.tableInfo.dataListShow));
    }

    // 设置弹窗的显示和隐藏
    @action
    setVisible = (flag) => {
        this.view.modalLoading = true;
        this.view.DetailsVisible = flag;
        this.view.modalLoading = false;
    }
}