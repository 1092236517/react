import { observable, action, computed } from "mobx";
import { message } from 'antd';
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { impPreview, expPreview, geneRemitSave } from 'ADMIN_SERVICE/ZXX_ReturnFee';

export class View extends BaseView {
    @observable searchValue = {
        TrgtSpId: undefined,
        SheetName: 'sheet1',
        ImportFile: []
    }

    @observable tableInfo = {
        dataList: [],
        loading: false,
        total: 0
    };

    @observable RecordListDataId = '';
}

export default class extends BaseViewStore {
    @action
    importPreview = async () => {
        const view = this.view;
        const {
            searchValue: { TrgtSpId, SheetName, ImportFile }
        } = view;

        let reqParam = {
            BucketKey: ImportFile[0].response.bucket,
            FileName: ImportFile[0].response.name.substr(1),
            SheetName,
            TrgtSpId
        };

        try {
            view.tableInfo.loading = true;
            let resData = await impPreview(reqParam);
            const { RecordList, RecordCount, RecordListDataId } = resData.Data;
            view.tableInfo = {
                dataList: RecordList || [],
                loading: false,
                total: RecordCount
            };
            view.RecordListDataId = RecordListDataId;
        } catch (err) {
            view.tableInfo.loading = false;
            message.error(err.message);
            console.log(err);
        }
    }

    @action
    expPreview = async () => {
        const view = this.view;
        const { searchValue: { TrgtSpId, SheetName, ImportFile }, RecordListDataId } = view;

        if (!RecordListDataId) {
            message.info('请先导入预览！');
            return;
        }

        let reqParam = {
            BucketKey: ImportFile[0].response.bucket,
            FileName: ImportFile[0].response.name.substr(1),
            RecordListDataId,
            SheetName,
            TrgtSpId
        };

        try {
            let resData = await expPreview(reqParam);
            const { Data: { FileUrl } } = resData;
            window.open(FileUrl);
        } catch (err) {
            message.error(err.message);
            console.log(err);
        }
    }

    @action
    geneRemitSave = async () => {
        const view = this.view;
        const { searchValue: { TrgtSpId, SheetName, ImportFile }, RecordListDataId } = view;

        if (!RecordListDataId) {
            message.info('请先导入预览！');
            return;
        }

        let reqParam = {
            BucketKey: ImportFile[0].response.bucket,
            FileName: ImportFile[0].response.name.substr(1),
            RecordListDataId,
            SheetName,
            TrgtSpId
        };

        try {
            view.tableInfo.loading = true;
            await geneRemitSave(reqParam);
            message.success('提交成功！');
            view.tableInfo = {
                dataList: [],
                loading: false,
                total: 0
            };
            view.RecordListDataId = '';
        } catch (err) {
            view.tableInfo.loading = false;
            message.error(err.message);
            console.log(err);
        }
    }

    @action
    resetTable = () => {
        const view = this.view;
        view.RecordListDataId = '';
        view.tableInfo = {
            dataList: [],
            total: 0
        };
    }

    @computed
    get enableImp() {
        return !this.view.RecordListDataId;
    }

    @action
    handleFormValuesChange = (values) => {
        this.view.searchValue = {
            ...this.view.searchValue,
            ...values
        };
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