import { observable, action } from "mobx";
import { message, Modal } from 'antd';
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { getPushList, getReceiveMember, getMemberByFilter, getMemberSelectDetail, saveImportData } from 'ADMIN_SERVICE/ZXX_SystemCfg';
import getClient from 'ADMIN_COMPONENTS/AliyunUpload/getClient';
import uploadRule from 'ADMIN_CONFIG/uploadRule';
import moment from 'moment';

export class View extends BaseView {
    @observable searchValue = {
        BeginDt: undefined,
        EndDt: undefined,
        KeyWords: ''
    }
    @observable filterSearchValue = {
        EntId: '',
        IntvDtEnd: undefined,
        IntvDtStart: undefined,
        TrgtSpId: '',
        WorkSts: ''
    }
    @observable pageStepOpt = {
        mainPage: true,
        addPage: false,
        receiveMemberImport: false,
        receiveMemberFilter: false,
        receiveMemberAll: false
    }
    @observable pagination = {
        current: 1,
        pageSize: 10
    }

    @observable tableInfo = {
        dataList: [],
        loading: false,
        total: 0
    };

    @observable paginationForMember = {
        current: 1,
        pageSize: 10
    }

    @observable memberInfo = {
        receiveMemberList: [],
        loading: false,
        total: 0,
        selectedRowKeys: []
    };
    @observable receiveMemberVisible = false;
    @observable modalLoading = false;
    @observable infoBean = { Title: '', BeginDt: '', EndDt: '', DayCount: '', Enable: 1, MsgText: '', MsgURL: '', ReceiveId: '', Typ: 1, TypDataIds: [] };
    @observable radioButtonBean = { Typ: 1, TypDataIds: [], DataId: '' };
    @observable ImageUrl = [];
    @observable importFile = [];
}

export default class extends BaseViewStore {
    // 设置弹窗的显示和隐藏
    @action
    setVisible = (visible, flag) => {
        this.view[visible] = flag;
    }
    @action
    handleFormValuesChange = (values) => {
        this.view.searchValue = values;
    }

    @action
    handleFormFilterValuesChange = (values) => {
        this.view.filterSearchValue = values;
    }

    @action
    startQuery = async () => {
        const view = this.view;
        const {
            searchValue: {
                BeginDt, EndDt, KeyWords
            },
            pagination: {
                current, pageSize
            }
        } = view;
        view.tableInfo.loading = true;

        let reqParam = {
            ...view.searchValue,
            BeginDt: BeginDt ? BeginDt.format('YYYY-MM-DD') : '',
            EndDt: EndDt ? EndDt.format('YYYY-MM-DD') : '',
            KeyWords,
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };
        console.log(reqParam);
        try {
            let resData = await getPushList(reqParam);
            let RecordList = resData.Data.RecordList;
            getClient(uploadRule.pushMant).then(data => {
                RecordList.map((item) => {
                    item.MsgURL = data.signatureUrl(item.MsgURL);
                });
                view.tableInfo = {
                    dataList: RecordList || [],
                    loading: false,
                    total: resData.Data.RecordCount
                };
            }).catch((err) => {
                view.tableInfo.loading = false;
                message.error(err.message);
            });
        } catch (err) {
            view.tableInfo.loading = false;
            message.error(err.message);
            console.log(err);
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
    setPaginationForMember = (current, pageSize) => {
        let view = this.view;
        view.paginationForMember = {
            current,
            pageSize
        };
        this.startQueryFilterTable();
    }

    @action
    resetPageCurrentForMember = () => {
        let view = this.view;
        view.paginationForMember = {
            ...view.paginationForMember,
            current: 1
        };
    }

    @action
    showAuditModal = () => {
        const rows = this.view.tableInfo.selectedRowKeys || [];
        if (rows.length == 0) {
            message.info('请选择一条记录！');
            return;
        }
        this.view.isShowAuditModal = true;
    }



    @action
    resetForm = () => {
        this.view.resetProperty('searchValue');
    }
    @action
    resetMemberForm = () => {
        this.view.resetProperty('filterSearchValue');
    }
    @action
    initPageStep = (values) => {
        this.view.tableInfo.loading = false;
        this.view.pageStepOpt = {
            ...this.view.pageStepOpt,
            mainPage: false,
            addPage: false,
            receiveMemberImport: false,
            receiveMemberFilter: false,
            receiveMemberAll: false
        };
    }
    // 查看接收会员信息-弹窗
    @action
    receiveMembertModal = async (dataId) => {
        this.view.modalLoading = true;
        this.setVisible('receiveMemberVisible', true);
        const { current, pageSize } = this.view.paginationForMember;
        let param = {
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize,
            DataId: dataId
        };
        this.view.memberInfo = { ...this.view.memberInfo, loading: true };
        let resData = await getMemberSelectDetail(param);
        this.view.memberInfo = {
            loading: false,
            receiveMemberList: resData.Data.RecordList,
            total: resData.Data.RecordCount
        };
    }
    // 关闭查看会员
    @action
    closeMemberModal = () => {
        this.setVisible('receiveMemberVisible', false);
    }
    // 增加公告信息
    @action
    addNoticeOpt = () => {
        this.initPageStep();
        this.view.pageStepOpt = {
            ...this.view.pageStepOpt,
            addPage: true
        };
        this.view.infoBean = { Title: '', BeginDt: moment(), EndDt: moment(), DayCount: '', Enable: 1, MsgText: '', MsgURL: '', ReceiveId: '', Typ: 1, TypDataIds: [] };
        this.view.memberInfo = {
            receiveMemberList: [],
            loading: false,
            total: 0,
            selectedRowKeys: []
        };
        this.view.ImageUrl = [];
        this.view.radioButtonBean = { Typ: 1, TypDataIds: [], DataId: '' };
        this.resetMemberForm();
    }
    // 取消增加公告信息
    @action
    toMainPage = () => {
        this.initPageStep();
        this.view.pageStepOpt = {
            ...this.view.pageStepOpt,
            mainPage: true
        };
    }
    // 修改公告信息
    @action
    modifyNoticeOpt = (obj) => {
        this.initPageStep();
        this.view.pageStepOpt = {
            ...this.view.pageStepOpt,
            addPage: true
        };
        this.view.infoBean = {
            Title: obj.Title,
            BeginDt: moment(obj.BeginDt, 'YYYY-MM-DD'),
            EndDt: moment(obj.EndDt, 'YYYY-MM-DD'),
            DayCount: obj.DayCount,
            Enable: obj.Enable,
            MsgText: obj.MsgText,
            MsgURL: obj.MsgURL,
            ReceiveId: 10000,
            ImageUrl: obj.MsgURL
        };
        this.view.radioButtonBean = {
            DataId: obj.DataId,
            Typ: 0,
            TypDataIds: []
        };
        this.view.ImageUrl = [{
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: obj.MsgURL
        }];
    }

    // 跳转接收会员操作
    @action
    receiveMemberOpt = () => {

        this.initPageStep();
        this.view.pageStepOpt = {
            ...this.view.pageStepOpt,
            receiveMemberImport: true
        };
        this.view.radioButtonBean = {
            ...this.view.radioButtonBean,
            Typ: 1
        };
        this.view.memberInfo = {
            receiveMemberList: [],
            loading: false,
            total: 0,
            selectedRowKeys: []
        };
        this.view.importFile = [];
        this.resetMemberForm();
    }
    @action
    handleInfoFormValuesChange = (values) => {
        this.view.infoBean = values;
    }
    // 保存上传图片的路径
    @action
    saveImage = (id, list) => {
        this.view[id] = list;
        console.log(id);
        console.log(list);
        if (list && list[0] && list[0].response) {
            console.log(list[0].response.name);
            this.view.infoBean = {
                ...this.view.infoBean,
                ...{
                    ImageUrl: list[0].response.name
                }
            };
        }
    }
    // 保存上传图片的路径
    @action
    receiveMemberTypeOpt = (optType) => {
        console.log(optType);
        this.initPageStep();
        this.view.memberInfo = {
            receiveMemberList: [],
            loading: false,
            total: 0,
            selectedRowKeys: []
        };
        if (optType === 1) {
            this.view.pageStepOpt = {
                ...this.view.pageStepOpt,
                receiveMemberImport: true
            };
            this.view.radioButtonBean = {
                ...this.view.radioButtonBean,
                ReceiveId: '', Typ: 1
            };
        }
        if (optType === 2) {
            this.view.pageStepOpt = {
                ...this.view.pageStepOpt,
                receiveMemberFilter: true
            };
            this.view.radioButtonBean = {
                ...this.view.radioButtonBean,
                ReceiveId: '', Typ: 2
            };
        }
        if (optType === 3) {
            this.view.pageStepOpt = {
                ...this.view.pageStepOpt,
                receiveMemberAll: true
            };
            this.view.radioButtonBean = {
                ...this.view.radioButtonBean,
                ReceiveId: '10000', Typ: 3
            };
            this.view.infoBean = { ...this.view.infoBean, ReceiveId: '10000' };
        }

    }
    @action
    setImportFile = async (id, list) => {
        if (id == 'ImportFile') {
            this.view.importFile = [...list];
            if (list && list.length > 0) {
                if (list[0].response) {
                    let param = {
                        BucketKey: list[0].response.bucket,
                        FileName: list[0].response.name.substr(1)
                    };
                    this.view.memberInfo = { ... this.view.memberInfo, loading: true };
                    let resData = await saveImportData(param);
                    this.view.memberInfo = {
                        receiveMemberList: resData.Data.RecordList || [],
                        loading: false,
                        total: resData.Data.RecordCount
                    };
                    this.view.infoBean = { ...this.view.infoBean, ReceiveId: resData.Data.ReceiveId };
                }
            }
        }
    }
    @action
    saveImportContent = () => {
        const { Typ, TypDataIds } = this.view.radioButtonBean;
        if ((Typ === 1 || Typ === 2) && TypDataIds.length === 0) {
            message.error('请选择一条记录');
            return;
        }
        this.initPageStep();
        this.view.pageStepOpt = {
            ...this.view.pageStepOpt,
            addPage: true
        };
    }
    @action
    startQueryFilterTable = async (id, list) => {
        const view = this.view;
        const {
            filterSearchValue: {
                EntId,
                IntvDtEnd,
                IntvDtStart,
                TrgtSpId,
                WorkSts
            },
            paginationForMember: {
                current, pageSize
            }
        } = view;
        view.tableInfo.loading = true;
        let param = {
            EntId: EntId ? EntId : -9999,
            IntvDtEnd: IntvDtEnd ? IntvDtEnd.format('YYYY-MM-DD') : '',
            IntvDtStart: IntvDtStart ? IntvDtStart.format('YYYY-MM-DD') : '',
            TrgtSpId: TrgtSpId ? TrgtSpId : -9999,
            WorkSts: WorkSts ? WorkSts : -9999,
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize
        };

        view.memberInfo = { ...view.memberInfo, loading: true };
        let resultData = await getMemberByFilter(param);
        view.memberInfo = {
            receiveMemberList: resultData.Data.RecordList,
            loading: false,
            total: resultData.Data.RecordCount
        };
        this.view.infoBean = { ...this.view.infoBean, ReceiveId: resultData.Data.ReceiveId };
    }
    @action
    setSelectRowKeys = (selectedRowKeys, selectedRows) => {
        this.view.memberInfo = {
            ...this.view.memberInfo,
            ...{
                selectedRowKeys: selectedRowKeys
            }
        };
        this.view.radioButtonBean = {
            ...this.view.radioButtonBean,
            ...{
                TypDataIds: selectedRows.map((item, index) => {
                    return item['DataId'];
                })
            }
        };
    }
    @action
    backToEditPage = () => {
        this.initPageStep();
        this.view.pageStepOpt = {
            ...this.view.pageStepOpt,
            addPage: true
        };
    }


}