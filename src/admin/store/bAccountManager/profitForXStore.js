import { BaseView, BaseViewStore } from 'ADMIN/store/BaseViewStore';
import { ProfitForX, ExportProfitForX, updataAdjustProfitXData } from 'ADMIN_SERVICE/ZXX_Busi_Manage';
import { message } from 'antd';
import { action, observable } from 'mobx';
import getClient from 'ADMIN_COMPONENTS/AliyunUpload/getClient';
import uploadRule from 'ADMIN_CONFIG/uploadRule';
import moment from 'moment';
export class View extends BaseView {
    @observable searchValue = {
        BeginMo: undefined,
        EndMo: undefined,
        EntId: undefined,
        TrgtSpId: undefined,
        IsTrgtSpArrears: undefined,
        IsClose: undefined
    };
    @observable justValue = {
        showJust: false,
        justTitle: '',
        uploadJustType: '',
        EntId: undefined,
        TrgtSpId: undefined,
        RelatedMo: undefined
    }
    @observable recordData = {};
    @observable infoModal = {
        adjustValue: '',
        ImportFile: [],
        ImportFileName: '',
        ImportFileOriginName: ''
    }

    @observable attachInfo = {};

    @observable RecordList = [];
    @observable pagination = {
        current: 1,
        pageSize: 10
    }

    @observable tableInfo = {
        dataList: [],
        loading: false,
        total: 0
    };
}
export default class extends BaseViewStore {
    @action
    startQuery = async () => {
        let view = this.view;
        view.RecordList = [];
        const { current, pageSize } = view.pagination;
        const { BeginMo, EndMo, EntId, TrgtSpId, IsTrgtSpArrears, IsClose } = view.searchValue;
        let query = {
            EntId: EntId || -9999,
            TrgtSpId: TrgtSpId || -9999,
            BeginMo: BeginMo ? BeginMo.format('YYYY-MM') + '-01' : '',
            EndMo: EndMo ? EndMo.format('YYYY-MM') + '-01' : '',
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize,
            IsTrgtSpArrears: IsTrgtSpArrears || -9999,
            IsClose: IsClose || -9999
        };
        try {
            view.tableInfo.loading = true;
            let [resData, ossClient] = await Promise.all([ProfitForX(query), getClient(uploadRule.profitX)]);

            const { RecordList = [], RecordCount } = resData.Data;
            let recordList = [];
            let totalIndex = 0;
            RecordList.forEach((bossItem, bossIndex) => {
                const { ZXProfit = [] } = bossItem;
                ZXProfit.forEach((laborItem, laborIndex) => {

                    let { PicInfo, ExcelInfo } = laborItem;
                    PicInfo = (PicInfo || []).map((file) => ({
                        ...file,
                        Url: ossClient.signatureUrl(file.Url, {
                            response: {
                                'content-disposition': `attachment; filename=${file.OriginName}`
                            }
                        })
                    }));
                    ExcelInfo = (ExcelInfo || []).map((file) => ({
                        ...file,
                        Url: ossClient.signatureUrl(file.Url, {
                            response: {
                                'content-disposition': `attachment; filename=${file.OriginName}`
                            }
                        })
                    }));
                    let item = {
                        ...bossItem,
                        ...laborItem,
                        BossRowSpan: 0,
                        PicInfo, ExcelInfo,
                        RowCombIndex: totalIndex++
                    };
                    if (bossItem.BossId != 0) {
                        if (laborIndex == 0) {
                            item.BossRowSpan = ZXProfit.length;
                        }
                    } else {
                        item.BossRowSpan = 1;
                    }

                    delete item.ZXProfit;
                    recordList.push(item);
                });

            });

            console.log(recordList);



            view.tableInfo = {
                dataList: recordList || [],
                loading: false,
                total: RecordCount
            };

            view.attachInfo = { ...resData.Data };
            delete view.attachInfo.RecordCount;
            delete view.attachInfo.RecordList;
        } catch (error) {
            view.tableInfo.loading = false;
            message.error(error.message);
            console.log(error);
        }
    }

    // 导出盈利列表
    @action
    exportProfitForX = async () => {
        let view = this.view;
        const { BeginMo, EndMo, EntId, TrgtSpId, IsTrgtSpArrears, IsClose } = view.searchValue;
        let query = {
            EntId: EntId || -9999,
            IsTrgtSpArrears: IsTrgtSpArrears || -9999,
            TrgtSpId: TrgtSpId || -9999,
            BeginMo: BeginMo ? BeginMo.format('YYYY-MM') + '-01' : '',
            EndMo: EndMo ? EndMo.format('YYYY-MM') + '-01' : '',
            IsClose: IsClose || -9999
        };
        try {
            let res = await ExportProfitForX(query);
            window.open(res.Data);
        } catch (error) {
            message.error(error.message);
            console.log(error);
        }
    }

    @action
    setPagination = (current, pageSize) => {
        let view = this.view;
        view.pagination = {
            current,
            pageSize
        };
        this.startQuery();
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

    @action
    editFinanceStatus = (rowIndex, state) => {
        //  列表慢查询优化
        // const view = this.view;
        // let newDataList = view.tableInfo.dataList.slice();
        // newDataList[rowIndex].IsClose = state;

        // view.tableInfo = {
        //     ...view.tableInfo,
        //     dataList: newDataList
        // };

        // 需要刷新列表
        this.startQuery();
    }

    @action
    updataAdjustProfit = async () => {
        let view = this.view;
        const { adjustValue, ImportFileName, ImportFileOriginName } = view.infoModal;
        const { uploadJustType, EntId, TrgtSpId, RelatedMo } = view.justValue;
        let query = {
            EntId: EntId || -9999,
            TrgtSpId: TrgtSpId || -9999,
            RelatedMo: RelatedMo ? moment(RelatedMo).format('YYYY-MM') + '-01' : '',
            AdjustY: 0,
            AdjustYUrl: "",
            AdjustYName: "",
            AdjustX: 0,
            AdjustXUrl: "",
            AdjustXName: ""
        };
        if (uploadJustType === 'AdjustY') {
            query.AdjustY = adjustValue ? parseInt(adjustValue, 10) : 0;
            query.AdjustYUrl = ImportFileName;
            query.AdjustYName = ImportFileOriginName;
        } else if (uploadJustType === 'AdjustX') {
            query.AdjustX = adjustValue ? parseInt(adjustValue, 10) : 0;
            query.AdjustXUrl = ImportFileName;
            query.AdjustXName = ImportFileOriginName;
        }
        try {
            await updataAdjustProfitXData(query);
            this.startQuery();
        } catch (error) {
            message.error(error.message);
            console.log(error);
        }
    }


    @action
    updataAdjustProfit = async () => {
        let view = this.view;
        let record = view.recordData;
        const { adjustValue, ImportFileName, ImportFileOriginName } = view.infoModal;
        const { uploadJustType, EntId, TrgtSpId, RelatedMo } = view.justValue;
        let query = {
            EntId: EntId || -9999,
            TrgtSpId: TrgtSpId || -9999,
            RelatedMo: RelatedMo ? moment(RelatedMo).format('YYYY-MM') + '-01' : '',
            AdjustY: record.AdjustY,
            AdjustYUrl: record.AdjustYUrl,
            AdjustYName: record.AdjustYName,
            AdjustX: record.AdjustX,
            AdjustXUrl: record.AdjustXUrl,
            AdjustXName: record.AdjustXName
        };
        if (uploadJustType === 'AdjustY') {
            query.AdjustY = adjustValue ? parseFloat(adjustValue, 10) * 100 : 0;
            query.AdjustYUrl = ImportFileName;
            query.AdjustYName = ImportFileOriginName;
        } else if (uploadJustType === 'AdjustX') {
            query.AdjustX = adjustValue ? parseFloat(adjustValue, 10) * 100 : 0;
            query.AdjustXUrl = ImportFileName;
            query.AdjustXName = ImportFileOriginName;
        }
        try {
            await updataAdjustProfitXData(query);
            this.startQuery();
        } catch (error) {
            message.error(error.message);
            console.log(error);
        }
    }


    @action
    setJustValue = (typeFlag, record) => {
        const view = this.view;
        view.recordData = record;
        view.infoModal = {
            ...view.infoModal,
            ImportFile: [],
            adjustValue: '',
            ImportFileOriginName: ''
        };
        if (typeFlag === 'AdjustY') {
            view.justValue = {
                ...view.justValue,
                showJust: true,
                justTitle: 'Y调整金额',
                uploadJustType: 'AdjustY',
                EntId: record.EntId,
                TrgtSpId: record.TrgtSpId,
                RelatedMo: record.RelatedMo

            };
            view.infoModal = {
                ...view.infoModal,
                adjustValue: record.AdjustY / 100

            };
        } else if (typeFlag === 'AdjustX') {
            view.justValue = {
                ...view.justValue,
                showJust: true,
                justTitle: 'X调整金额',
                uploadJustType: 'AdjustX',
                EntId: record.EntId,
                TrgtSpId: record.TrgtSpId,
                RelatedMo: record.RelatedMo

            };
            view.infoModal = {
                ...view.infoModal,
                adjustValue: record.AdjustX / 100

            };
        }
    }
    @action
    showAndHideModal = (typeFlag) => {
        if (typeFlag === 'ok') {
            this.view.justValue.showJust = false;
            this.updataAdjustProfit();
        }
        if (typeFlag === 'cancel') {
            this.view.justValue.showJust = false;
        }
    }
    @action
    setImportFile = (FileList) => {
        this.view.infoModal = {
            ...this.view.infoModal,
            ImportFile: [...FileList]

        };
        if (FileList[0] && FileList[0].response) {
            this.view.infoModal = {
                ...this.view.infoModal,
                ImportFileName: FileList[0].response.name.substr(1),
                ImportFileOriginName: FileList[0].name
            };
        } else {
            this.view.infoModal = {
                ...this.view.infoModal,
                ImportFileName: '',
                ImportFileOriginName: ''
            };
        }
        // 触发页面渲染
        this.view.justValue = {
            ...this.view.justValue,
            showJust: false
        };
        this.view.justValue = {
            ...this.view.justValue,
            showJust: true
        };
    }
    @action
    handleModalFormValuesChange = (values) => {
        this.view.infoModal = {
            ...this.view.infoModal,
            adjustValue: values.adjustValue
        };
    }




}