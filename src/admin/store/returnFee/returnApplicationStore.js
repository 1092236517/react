import { observable, action, computed } from "mobx";
import { message } from 'antd';
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { returnApplicationImport } from 'ADMIN_SERVICE/ZXX_ReturnFeeBill';

export class View extends BaseView {
    @observable searchValue = {
        SheetName: 'sheet1'
    }

    @observable tableInfo = {
        //  原始数据
        dataList: [],
        //  当前显示的数据
        dataListShow: [],
        loading: false
    };
    @observable importFile = [];
    @observable tableVisible = false;
    @observable fileMD5 = '';

    @observable recoreMsg = ""
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

    @action
    importPreview = async () => {
        const view = this.view;
        const {
            searchValue: {
                SheetName
            },
            importFile
        } = view;

        view.tableInfo.loading = true;

        let reqParam = {
            SheetName,
            BucketKey: importFile[0].response.bucket,
            FileName: importFile[0].response.name.substr(1)
        };

        try {
            view.tableVisible = true;
            let resData = await returnApplicationImport(reqParam);
            view.recoreMsg = resData.Data.ResultDesc;
            // view.tableInfo = {
            //     dataList: resData.RecordList,
            //     dataListShow: []
            // };

        } catch (err) {
            view.tableInfo.loading = false;
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
    }
}
