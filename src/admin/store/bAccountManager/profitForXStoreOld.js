import { BaseView, BaseViewStore } from 'ADMIN/store/BaseViewStore';
import { ProfitForXOld, ExportProfitForXOld } from 'ADMIN_SERVICE/ZXX_Busi_Manage';
import { message } from 'antd';
import { action, observable } from 'mobx';
import getClient from 'ADMIN_COMPONENTS/AliyunUpload/getClient';
import uploadRule from 'ADMIN_CONFIG/uploadRule';

export class View extends BaseView {
    @observable searchValue = {
        BeginMo: undefined,
        EndMo: undefined,
        EntId: undefined,
        TrgtSpId: undefined
    };

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
        const { BeginMo, EndMo, EntId, TrgtSpId } = view.searchValue;
        let query = {
            EntId: EntId || -9999,
            TrgtSpId: TrgtSpId || -9999,
            BeginMo: BeginMo ? BeginMo.format('YYYY-MM') + '-01' : '',
            EndMo: EndMo ? EndMo.format('YYYY-MM') + '-01' : '',
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };
        try {
            view.tableInfo.loading = true;
            let [resData, ossClient] = await Promise.all([ProfitForXOld(query), getClient(uploadRule.profitX)]);

            let { Data: { RecordCount, RecordList } } = resData;

            RecordList = (RecordList || []).map((record) => {
                let { PicInfo, ExcelInfo } = record;
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

                console.log(PicInfo);
                return {
                    ...record,
                    PicInfo,
                    ExcelInfo
                };
            });

            view.tableInfo = {
                dataList: RecordList || [],
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
    exportProfitForXOld = async () => {
        let view = this.view;
        const { BeginMo, EndMo, EntId, TrgtSpId } = view.searchValue;
        let query = {
            EntId: EntId || -9999,
            TrgtSpId: TrgtSpId || -9999,
            BeginMo: BeginMo ? BeginMo.format('YYYY-MM') + '-01' : '',
            EndMo: EndMo ? EndMo.format('YYYY-MM') + '-01' : ''
        };
        try {
            let res = await ExportProfitForXOld(query);
            window.open(res.Data.FileUrl);
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
        this.startQuery();
    }
}
