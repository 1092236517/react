import { BaseView, BaseViewStore } from 'ADMIN/store/BaseViewStore';
import getClient from 'ADMIN_COMPONENTS/AliyunUpload/getClient';
import uploadRule from 'ADMIN_CONFIG/uploadRule';
import { getAllCompanyInfo } from 'ADMIN_SERVICE/ZXX_BaseData';
import { Audit, ExportList, FundAdujEdit, GetAccoutInfoBySPID, GetByID, GetList, ImportPreview, Request, SplitById, SaveVmData, requestRedRush } from 'ADMIN_SERVICE/ZXX_FundAduj';
import { homeStore } from 'ADMIN_STORE';
import { safeDiv, safeMul } from 'ADMIN_UTILS/math';
import { message, Modal } from 'antd';
import { action, observable } from 'mobx';
import moment from 'moment';
import React from 'react';
import { accMul } from 'ADMIN_UTILS/tableItemRender';
export class View extends BaseView {
    @observable searchValue = { // PayAccountName查询
        BeginDate: null,
        EndDate: null,
        SPID: [], // 劳务ID
        SPContactName: "", // 服务商联系人
        SPContactMobile: "", // 手机号
        OPType: -9999, // 交易类型
        AuditStatus: -9999, // 审核状态
        SplitSts: -9999,
        BankTransferTmE: undefined,
        BankTransferTmS: undefined,
        IsVirtual: -9999,
        RecordID: '',
        BeRedRushID: '',
        IsDeposit: -9999,
        IsRedRush: -9999
    };
    @observable RequestValue = { // 出入金申请
        Amount: null, // 金额
        PayAccountName: "", // 付款账户名
        PayBankCardNo: "", // 付款银行卡号
        PayBankName: "", // 付款银行名称
        RecvAccountName: "", // 收款账户名
        RecvBankCardNo: "", // 付款银行卡号
        RecvBankName: "", // 收款银行名称
        BankOrderID: "", // 银行流水号
        Remark: "",
        BeRedRunRecordID: "",
        IsVirtual: 2
    };
    @observable ImageUrl = ""; // 银行凭证

    @observable AuditStatus = 1; // 查看时的审核状态
    @observable SplitSts = 1; // 查看时拆分的状态
    @observable showImg = '';

    // 上传excel
    @observable excelValue = {
        SheetName: 'sheet1',
        ImportFile: []
    }
    @observable flag = false;
    @observable dis = false;
    @observable rightBoxVis = false;
    @observable ErrorList = {
        FormatErrorList: [],
        LackParamList: [],
        RepeatParamList: []
    };
    @observable ExcelRecordList = [];
    @observable ExcelData = {
        PayBankNameExc: '',
        RecvBankNameExc: '',
        SPNameExc: ''
    }
    @observable commitedImage = '';
    @observable laborList = [];

    // 样式
    @observable uncommited = null;
    @observable commited = null;

    @observable LabourInfo = {
        SPID: null, // 劳务id
        SPShortName: "", // 劳务名称
        SPFullName: "", // 劳务全称
        SPContactMobile: "", // 联系电话
        SPContactName: "" // 联系人
    }

    @observable InfoVisible = false;

    @observable SPType = 2; // 服务商类型 传劳务为2
    @observable OPType = -9999; // 交易类型

    @observable AuditValue = {
        AuditStatus: 2, // 审批结果 2:通过；3:拒绝
        RecordID: 0, // 记录id
        Remark: "" // 备注
    }

    @observable RecordID = ""; // 申请记录id
    @observable tempSpid = null; // 临时存储劳务id

    @observable FindValue = {
        Balance: null, // 业务资金账户余额
        DepositAmount: null // 押金账户余额
    };

    @observable RecordList = [];
    @observable pagination = {
        current: 1,
        pageSize: 10
    }
    @observable totalNum = 0; // 总条数
    @observable visible = false; // 新增、修改发薪申请可见
    @observable index = null; // 标记修改第几条数据
    @observable title = 0; // 设置modal的title为新增/修改
    @observable FormListStatus = 'close';

    // 催账单
    @observable DunningNum = 0;
    @observable dunningKeys = [];
    @observable tempValue = {}; // 存储催账单的值 
    @observable SplitDetailList = [];
    @observable DepositAmt = 0;
    @observable RiskFundFee = 0;
    @observable indexNum = 0;
    @observable len = 0;
    @observable depositShow = 'none';
    @observable riskFundShow = 'none';
    @observable edit = true;
    @observable dele = false;

    // ZX模式
    @observable ZXDunningNum = 0;
    @observable ZXdunningKeys = [];
    @observable ZXtempValue = {}; // 存储zx的值 
    @observable ZXSplitDetailList = [];
    @observable ZXindexNum = 0;
    @observable ZXlen = 0;

    // profit拆分
    @observable profitDunningNum = 0;
    @observable profitdunningKeys = [];
    @observable profittempValue = {}; // 存储profit的值 
    @observable ProfitSplitDetailList = [];
    @observable profitIndexNum = 0;
    @observable profitlen = 0;

    // tax拆分
    @observable taxDunningNum = 0;
    @observable taxdunningKeys = [];
    @observable taxtempValue = {}; // 存储tax的值 
    @observable TaxBackDetailList = [];
    @observable taxIndexNum = 0;
    @observable taxlen = 0;

    @observable hideSpl = false;

    @observable subDis = false; // 避免双击多次请求后台接口
    @observable transferType = 1;

}

export default class extends BaseViewStore {
    // 获取出入金列表
    @action
    getList = async () => {
        let view = this.view;
        view.RecordList = [];
        view.FormListStatus = 'pending';
        const { current, pageSize } = view.pagination;
        const { BeginDate, EndDate, SPID, OPType, AuditStatus, SplitSts, BankTransferTmE, BankTransferTmS, RecordID, IsDeposit, IsVirtual, IsRedRush, BeRedRushID } = view.searchValue;
        let query = {
            ...view.searchValue,
            AuditStatus: AuditStatus ? AuditStatus * 1 : -9999,
            SplitSts: SplitSts ? SplitSts * 1 : -9999,
            SPID: SPID ? SPID : [],
            OPType: OPType ? OPType * 1 : -9999,
            BeginDate: BeginDate ? BeginDate.format('YYYY-MM-DD') : "",
            EndDate: EndDate ? EndDate.format('YYYY-MM-DD') : "",
            BankTransferTmE: BankTransferTmE ? BankTransferTmE.format('YYYY-MM-DD') : "",
            BankTransferTmS: BankTransferTmS ? BankTransferTmS.format('YYYY-MM-DD') : "",
            RecordID: RecordID ? RecordID * 1 : -9999,
            RecordIndex: (current - 1) * pageSize,
            RecordSize: pageSize,
            IsVirtual: IsVirtual ? IsVirtual * 1 : -9999,
            IsDeposit: IsDeposit ? IsDeposit * 1 : -9999,
            IsRedRush: IsRedRush ? IsRedRush * 1 : -9999,
            BeRedRushID: BeRedRushID ? BeRedRushID * 1 : 0
        };
        try {
            let res = await GetList(query);
            let Data = res.Data;
            view.FormListStatus = 'done';
            view.RecordList = Data.RecordList || [];
            view.totalNum = Data.RecordCount;
            return Data;
        } catch (error) {
            view.FormListStatus = 'error';
            message.error(error.message);
            console.log(error);
        }
    }
    @action
    searchByInput = async (formData) => {
        this.view.searchValue = {
            ...this.view.searchValue,
            ...formData,
            IsDeposit: -9999
        };
        await this.getList();
    }

    // 出入金申请
    @action
    request = async (callBack) => {
        let view = this.view;

        if (view.OPType === 3) {
            let query = {};
            query.SPID = view.LabourInfo.SPID * 1;
            if (view.ImageUrl[0]) {
                query.ImageUrl = view.ImageUrl[0].response.name;
            } else {
                query.ImageUrl = '';
            }
            query.Remark = view.RequestValue.Remark;
            query.Amount = accMul(view.RequestValue.Amount, 100);
            try {
                let res = await SaveVmData(query);
                let Data = res.Data;
                view.FormListStatus = 'done';
                message.success("申请提交成功");
                callBack && callBack();
                this.getList();
                view.subDis = false;
                return Data;
            } catch (error) {
                view.FormListStatus = 'error';
                view.subDis = false;
                console.log(error);
            }

        } else {
            view.subDis = true;
            view.FormListStatus = 'pending';
            let query = { ...view.RequestValue };
            var x = view.RequestValue.Amount;
            var y = String(x).indexOf(".") + 1; // 获取小数点的位置
            var count = String(x).length - y; // 获取小数点后的个数
            if (count === 2 || count === 1 || y <= 0) {
                query.Amount = safeMul(view.RequestValue.Amount, 100);
            }
            query.SPID = view.LabourInfo.SPID * 1;
            query.OPType = view.OPType;
            query.SPType = view.SPType;
            if (view.ImageUrl[0]) {
                // // 改为传对象数组给后台，实现传多张凭证
                // console.log(view.ImageUrl);
                // let x = [];
                // for (let i = 0; i < view.ImageUrl.length; i++) {
                //     x.push(view.ImageUrl[i].response.name);
                // }
                // console.log(x); // x为传入的图片地址url数组
                query.ImageUrl = view.ImageUrl[0].response.name;
            } else {
                query.ImageUrl = '';
            }
            query.BankTransferTm = view.RequestValue.BankTransferTm.format('YYYY-MM-DD');
            query.BeRedRunRecordID = query.BeRedRunRecordID ? parseInt(query.BeRedRunRecordID, 10) : 0;
            try {
                let res = await Request(query);
                let Data = res.Data;
                view.FormListStatus = 'done';
                message.success("申请提交成功");
                callBack && callBack();
                this.getList();
                view.subDis = false;
                return Data;
            } catch (error) {
                if (y > 0 && count > 2) {
                    message.error("金额精确到分，请输入两位小数的金额！");
                } else {
                    message.error(error.message);
                }
                view.FormListStatus = 'error';
                view.subDis = false;
                console.log(error);
            }
        }
    }

    // 未审核时，查看时编辑
    @action
    fundAdujEdit = async (RecordID) => {
        let view = this.view;
        view.FormListStatus = 'pending';
        let query = { ...view.RequestValue };
        var x = view.RequestValue.Amount;
        var y = String(x).indexOf(".") + 1; // 获取小数点的位置
        var count = String(x).length - y; // 获取小数点后的个数
        if (count === 2 || count === 1 || y <= 0) {
            query.Amount = safeMul(view.RequestValue.Amount, 100);
        }
        query.BankTransferTm = view.RequestValue.BankTransferTm.format('YYYY-MM-DD');
        query.RecordID = RecordID * 1;
        if (view.ImageUrl[0]) {
            query.ImageUrl = view.ImageUrl[0].response.name;
        } else {
            query.ImageUrl = '';
        }
        try {
            let res = await FundAdujEdit(query);
            let Data = res.Data;
            view.FormListStatus = 'done';
            message.success("修改提交成功");
            this.getList();
            return Data;
        } catch (error) {
            if (y > 0 && count > 2) {
                message.error("金额精确到分，请输入两位小数的金额！");
            } else {
                message.error(error.message);
            }
            view.FormListStatus = 'error';
            console.log(error);
        }
    }

    // 金额修改时，隐藏已拆分的项
    @action
    hideSpl = (bool) => {
        this.view.hideSpl = bool;
    }

    // 获取单个出入金记录
    @action
    getByID = async (id) => {
        let view = this.view;
        view.RecordList = [];
        view.RecordID = id;
        view.FormListStatus = 'pending';
        let query = { RecordID: id * 1 };
        try {
            let res = await GetByID(query);
            let Data = res.Data;
            view.FormListStatus = 'done';
            view.RecordList = Data.RecordList || [];
            let tempData = Data.RecordList[0];
            view.SplitDetailList = tempData.SplitDetailList;
            view.ZXSplitDetailList = tempData.ZxSplitDetailList;
            view.ProfitSplitDetailList = tempData.ProfitSplitDetailList;
            view.TaxBackDetailList = tempData.TaxBackDetailList;
            view.SplitSts = tempData.SplitSts;
            view.DepositAmt = tempData.DepositAmt;
            view.RiskFundFee = tempData.RiskFundAmt;
            view.len = view.SplitDetailList.length;
            view.ZXlen = view.ZXSplitDetailList.length;
            view.profitlen = view.ProfitSplitDetailList.length;
            view.taxlen = view.TaxBackDetailList.length;
            if (view.len > 0) {
                for (var i = 0; i < view.len; i++) {
                    view.DunningNum++;
                    view.indexNum++;
                    view.dunningKeys = view.dunningKeys.concat(i);
                }
            }
            if (view.ZXlen > 0) {
                for (var j = 0; j < view.ZXlen; j++) {
                    view.ZXDunningNum++;
                    view.ZXindexNum++;
                    view.ZXdunningKeys = view.ZXdunningKeys.concat(j);
                }
            }

            if (view.profitlen > 0) {
                for (var k = 0; k < view.profitlen; k++) {
                    view.profitDunningNum++;
                    view.profitIndexNum++;
                    view.profitdunningKeys = view.profitdunningKeys.concat(k);
                }
            }

            if (view.taxlen > 0) {
                for (var m = 0; m < view.taxlen; m++) {
                    view.taxDunningNum++;
                    view.taxIndexNum++;
                    view.taxdunningKeys = view.taxdunningKeys.concat(m);
                }
            }

            if (tempData.DepositAmt !== 0) {
                view.depositShow = 'block';
            }

            if (tempData.RiskFundAmt !== 0) {
                view.riskFundShow = 'block';
            }

            view.LabourInfo = {
                SPID: tempData.SPID * 1,
                SPShortName: tempData.SPShortName,
                SPFullName: tempData.SPFullName,
                SPContactMobile: tempData.SPContactMobile,
                SPContactName: tempData.SPContactName
            };

            view.OPType = tempData.OPType;
            view.AuditValue.Remark = tempData.AuditRemark;

            view.AuditStatus = tempData.AuditStatus;
            view.SplitSts = tempData.SplitSts;

            // 仅查看图片
            const aliyunClient = await getClient(uploadRule.labourCertificate);
            view.showImg = aliyunClient.signatureUrl(Data.RecordList[0].ImageUrl);

            getClient(uploadRule.labourCertificate).then((client) => {
                if (Data.RecordList[0].ImageUrl) {
                    view.ImageUrl = Data.RecordList[0].ImageUrl.split(',').map(url => ({
                        status: 'done',
                        uid: url,
                        name: url,
                        url: client.signatureUrl(url),
                        response: {
                            name: url
                        }
                    }));
                }
            });

            view.RequestValue = {
                Amount: tempData.Amount / 100,
                PayAccountName: tempData.PayAccountName,
                PayBankCardNo: tempData.PayBankCardNo,
                PayBankName: tempData.PayBankName,
                RecvAccountName: tempData.RecvAccountName,
                RecvBankCardNo: tempData.RecvBankCardNo,
                RecvBankName: tempData.RecvBankName,
                BankOrderID: tempData.BankOrderID,
                BankTransferTm: moment(tempData.BankTransferTm),
                Remark: tempData.Remark
            };
            return Data;
        } catch (error) {
            view.FormListStatus = 'error';
            message.error(error.message);
            console.log(error);
        }
    }

    // 获取用户押金和账户余额
    @action
    getAccoutInfoBySPID = async (SPID, shortName, fullName, mobile, name) => {
        let view = this.view;
        view.RecordList = [];
        view.FormListStatus = 'pending';
        let query = { SPID: SPID * 1 };
        if (shortName) {
            view.LabourInfo = {
                SPID: SPID * 1,
                SPShortName: shortName,
                SPFullName: fullName,
                SPContactMobile: mobile,
                SPContactName: name
            };
        } else {
            view.LabourInfo.SPID = SPID * 1;
        }
        try {
            let res = await GetAccoutInfoBySPID(query);
            let Data = res.Data;
            view.FormListStatus = 'done';
            view.FindValue = {
                Balance: Data.Balance,
                DepositAmount: Data.DepositAmount
            };
            return Data;
        } catch (error) {
            view.FormListStatus = 'error';
            message.error(error.message);
            console.log(error);
        }
    }

    // 出入金审批
    @action
    audit = async (status, SplitTm, callBack) => {
        let view = this.view;
        view.FormListStatus = 'pending';
        view.AuditValue.AuditStatus = status;
        view.AuditValue.RecordID = view.RecordID * 1;
        let query = {};
        if (view.AuditValue.Remark) {
            query = { ...view.AuditValue };
            query.SplitTm = SplitTm;
        } else {
            message.error("备注必填");
            return;
        }
        try {
            let res = await Audit(query);
            let Data = res.Data;
            view.FormListStatus = 'done';
            message.success("已审核");
            callBack && callBack();
            this.getList();
            return Data;
        } catch (error) {
            view.FormListStatus = 'error';
            message.error(error.message);
            console.log(error);
        }
    }

    // 交易类型选择
    @action
    getTradeType = async (value) => {
        this.view.OPType = value;
        this.view.InfoVisible = true; // 交易类型存在时，列表可见
        this.view.RequestValue = {
            ... this.view.RequestValue,
            Amount: null,
            Remark: ''
        };
        this.view.ImageUrl = '';
    }

    // 交易类型选择
    @action
    getTransferType = async (value) => {
        this.view.transferType = value;
    }
    //  设置分页
    @action
    setPagination = (current, pageSize) => {
        let view = this.view;
        view.pagination = {
            current,
            pageSize
        };
        this.getList();
    }

    @action
    resetPageCurrent = () => {
        let view = this.view;
        view.pagination = {
            ...view.pagination,
            current: 1
        };
    }

    // 导出出入金列表
    @action
    exportList = async () => {
        let view = this.view;
        view.RecordList = [];
        view.FormListStatus = 'pending';
        const { BeginDate, EndDate, SPID, OPType, AuditStatus, SplitSts, BankTransferTmE, BankTransferTmS, RecordID, IsDeposit, IsVirtual, IsRedRush, BeRedRushID } = view.searchValue;
        let query = {
            ...view.searchValue,
            AuditStatus: AuditStatus ? AuditStatus * 1 : -9999,
            SplitSts: SplitSts ? SplitSts * 1 : -9999,
            SPID: SPID,
            OPType: OPType ? OPType * 1 : -9999,
            BeginDate: BeginDate ? BeginDate.format('YYYY-MM-DD') : "",
            EndDate: EndDate ? EndDate.format('YYYY-MM-DD') : "",
            BankTransferTmE: BankTransferTmE ? BankTransferTmE.format('YYYY-MM-DD') : "",
            BankTransferTmS: BankTransferTmS ? BankTransferTmS.format('YYYY-MM-DD') : "",
            IsVirtual: IsVirtual ? IsVirtual * 1 : -9999,
            RecordID: RecordID ? RecordID * 1 : -9999,
            IsDeposit: IsDeposit ? IsDeposit * 1 : -9999,
            IsRedRush: IsRedRush ? IsRedRush * 1 : -9999,
            BeRedRushID: BeRedRushID ? BeRedRushID * 1 : 0
        };

        try {
            let res = await ExportList(query);
            let Data = res.Data;
            view.FormListStatus = 'done';
            view.RecordList = Data.RecordList || [];
            view.totalNum = Data.RecordCount;
            this.getList();
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
    SheetNameValueChange = (values) => {
        this.view.excelValue.SheetName = values.SheetName;
    }

    @action
    handleFormReset = () => {
        this.view.resetProperty('searchValue');
    }

    @action
    handleFindFormReset = () => {
        this.view.resetProperty('FindValue');
    }

    @action
    handleRequestFormValuesChange = (values) => {
        this.view.RequestValue = values;
    }

    @action
    handleRequestFindFormReset = () => {
        this.view.resetProperty('RequestValue');
    }

    // 保存上传图片的路径
    @action
    saveImage = (id, list) => {
        console.log("list=======" + list);
        this.view[id] = list;
    }

    // 获取备注
    @action
    getRemark = (val) => {
        this.view.AuditValue.Remark = val;
    }

    // 导入excel
    @action
    setImportFile = (id, list) => {
        if (id == 'ImportFile') {
            this.view.excelValue = {
                ...this.view.excelValue,
                ImportFile: [...list]
            };
        }
    }

    // 取消导入
    @action
    resetImport = () => {
        let view = this.view;
        view.resetProperty('excelValue');
        view.rightBoxVis = false;
        view.flag = false;
        view.RequestValue = {};
        view.ExcelData = {};
        view.LabourInfo = {};
        view.commitedImage = '';
        view.OPType = -9999;
        view.dis = false;
        view.uncommited = null;
        view.commited = null;
        view.FindValue = {
            Balance: null,
            DepositAmount: null
        };
    }

    // 导入Excel
    @action
    importPreview = async (commited) => {
        const view = this.view;
        // view.commited = null;
        if (commited) {
            view.dis = true;
        }
        view.flag = false;
        view.rightBoxVis = false;
        const {
            excelValue: {
                SheetName,
                ImportFile
            }
        } = view;
        view.rightBoxVis = true;
        let reqParam = {
            SheetName,
            BucketKey: ImportFile[0].response.bucket,
            FileName: ImportFile[0].response.name.substr(1)
        };
        try {
            view.tableVisible = true;
            let res = await ImportPreview(reqParam);
            let Data = res.Data;
            view.FormListStatus = 'done';
            view.ErrorList = Data.ErrorList;
            view.ExcelRecordList = (Data.RecordList || []).map((item, primaryIndex) => ({ ...item, primaryIndex }));
            let formatError = view.ErrorList.FormatErrorList.length > 0 ? view.ErrorList.FormatErrorList.map((item) => {
                return ' \"' + item + '\" ';
            }) + ' 格式错误' : '';
            let lack = view.ErrorList.LackParamList.length > 0 ? view.ErrorList.LackParamList.map((item) => {
                return ' \"' + item + '\" ';
            }) + ' 缺失' : '';
            let repeat = view.ErrorList.RepeatParamList.length > 0 ? view.ErrorList.RepeatParamList.map((item) => {
                return ' \"' + item + '\" ';
            }) + ' 重复' : '';
            const content = (
                <div>
                    <p>所选导入文件中</p>
                    <p>{formatError}</p>
                    <p>{lack}</p>
                    <p>{repeat}</p>
                </div>
            );
            view.flag = view.ErrorList.FormatErrorList.length > 0 || view.ErrorList.LackParamList.length > 0 || view.ErrorList.RepeatParamList.length > 0 ? true : false;

            if (view.flag) {
                Modal.warning({
                    title: '',
                    okText: "我去修改文件",
                    content: (content),
                    style: { "top": "30%" }
                });
            }
            return Data;
        } catch (err) {
            message.error(err.message);
            console.log(err);
        }
    }

    // 左侧列表填入信息
    @action
    setInfo = async (dis, primaryIndex) => {
        const view = this.view;
        view.commitedImage = '';
        view.ImageUrl = '';
        view.dis = dis;
        let chosedData = view.ExcelRecordList.filter((item, index) => {
            return item.primaryIndex === primaryIndex;
        });
        let thisData = chosedData[0];
        if (chosedData.length > 0) {
            view.RequestValue = { ...thisData };
            view.ExcelData = { ...thisData };
            view.LabourInfo = { ...thisData };
            view.RequestValue.BankTransferTm = moment(thisData.BankTransferTm);
            view.RequestValue.Amount = safeDiv(thisData.Amount, 100);

            let spid = [];
            this.getLaborList().then(function (result) {
                spid = result.filter((item, index) => {
                    return item.SpId == view.LabourInfo.SPID * 1;
                });
                if (spid.length == 0) {
                    view.LabourInfo.SPID = null;
                }
            }
            );

            const aliyunClient = await getClient(uploadRule.labourCertificate);
            view.commitedImage = thisData.FileUrl !== '' ? aliyunClient.signatureUrl(thisData.FileUrl) : '';
            view.OPType = thisData.OPType;
            this.getAccoutInfoBySPID(thisData.SPID * 1);
        }
    }

    @action.bound
    async getLaborList() {
        try {
            const res = await getAllCompanyInfo({
                SpTypeList: [2]
            });
            this.view.laborList = res.Data.LaborList || [];
            return res.Data.LaborList;
        } catch (err) {
            message.error(err.message);
            console.log(err);
        }
    }


    // 设置点击之后的样式
    @action
    setBg = (record, index, type) => {
        this.view.uncommited = null;
        this.view.commited = null;
        if (record.IsExsit === index) {
            this.view[type] = record.primaryIndex;
        } else {
            this.view[type] = null;
        }
    }

    // 催账单
    handleBillFormValuesChange = (values) => {
        this.view.tempValue = values;
    }

    // ZX
    ZXhandleBillFormValuesChange = (values) => {
        this.view.ZXtempValue = values;
    }

    // profit
    profithandleBillFormValuesChange = (values) => {
        this.view.profittempValue = values;
    }

    // tax
    taxhandleBillFormValuesChange = (values) => {
        this.view.taxtempValue = values;
    }

    // 新增催款项
    @action
    setdunning = (fun) => {
        let view = this.view;
        view.dele = true;
        if (view.indexNum >= 50) {
            message.warning("拆分项目已达到最大限制");
        } else {
            view.indexNum++;
            view.DunningNum++;
            view.dunningKeys = view.dunningKeys.concat(view.DunningNum);
            fun({ dunningKeys: view.dunningKeys });
            this.editValue();
        }
    }

    // 新增ZX项
    @action
    ZXsetdunning = (fun) => {
        let view = this.view;
        view.dele = true;
        if (view.ZXindexNum >= 50) {
            message.warning("拆分项目已达到最大限制");
        } else {
            view.ZXindexNum++;
            view.ZXDunningNum++;
            view.ZXdunningKeys = view.ZXdunningKeys.concat(view.ZXDunningNum);
            fun({ ZXdunningKeys: view.ZXdunningKeys });
            this.editValue();
        }
    }
    // 新增利润项
    @action
    profitsetdunning = (fun) => {
        let view = this.view;
        view.dele = true;
        if (view.profitIndexNum >= 50) {
            message.warning("拆分项目已达到最大限制");
        } else {
            view.profitIndexNum++;
            view.profitDunningNum++;
            view.profitdunningKeys = view.profitdunningKeys.concat(view.profitDunningNum);
            fun({ profitdunningKeys: view.profitdunningKeys });
            this.editValue();
        }
    }

    // 新增退税项
    @action
    taxsetdunning = (fun) => {
        let view = this.view;
        view.dele = true;
        if (view.taxIndexNum >= 50) {
            message.warning("拆分项目已达到最大限制");
        } else {
            view.taxIndexNum++;
            view.taxDunningNum++;
            view.taxdunningKeys = view.taxdunningKeys.concat(view.taxDunningNum);
            fun({ taxdunningKeys: view.taxdunningKeys });
            this.editValue();
        }
    }

    // 催账单明细删除
    @action
    dunningDelete = (k, fun) => {
        this.view.dunningKeys = this.view.dunningKeys.filter(key => key !== (k));
        fun({
            dunningKeys: this.view.dunningKeys
        });
        this.view.indexNum--;
    }

    // ZX明细删除
    @action
    ZXdunningDelete = (k, fun) => {
        let view = this.view;
        view.ZXdunningKeys = view.ZXdunningKeys.filter(key => key !== (k));
        fun({
            ZXdunningKeys: view.ZXdunningKeys
        });
        view.ZXindexNum--;
    }

    // 利润明细删除
    @action
    profitdunningDelete = (k, fun) => {
        let view = this.view;
        view.profitdunningKeys = view.profitdunningKeys.filter(key => key !== (k));
        fun({
            profitdunningKeys: view.profitdunningKeys
        });
        view.profitIndexNum--;
    }

    // 退税明细删除
    @action
    taxdunningDelete = (k, fun) => {
        let view = this.view;
        view.taxdunningKeys = view.taxdunningKeys.filter(key => key !== (k));
        fun({
            taxdunningKeys: view.taxdunningKeys
        });
        view.taxIndexNum--;
    }


    // 押金删除
    depositDelete = (depositShow) => {
        this.view.depositShow = depositShow;
        this.view.DepositAmt = 0;
    }

    // 风险金删除
    riskFundDelete = (riskFundShow) => {
        this.view.riskFundShow = riskFundShow;
        this.view.RiskFundFee = 0;
    }

    // 编辑修改
    editValue = () => {
        this.view.edit = false;
        this.view.dele = true;
    }

    // 单个出入金拆分
    @action
    splitById = async (query) => {
        let view = this.view;
        try {
            let res = await SplitById(query);
            let Data = res.Data;
            view.FormListStatus = 'done';
            message.success("拆分成功");
            homeStore.handleTabOperate('close');
            this.getList();
            view.dele = false;
            return Data;
        } catch (error) {
            message.error(error.message);
            view.FormListStatus = 'error';
            console.log(error);
        }
    }
    @action
    searchByRedirectValue = async (SPID) => {
        this.view.searchValue = {
            ...this.view.searchValue,
            SPID: SPID,
            IsDeposit: 1,
            SplitSts: 2,
            AuditStatus: 2
        };
        await this.getList();
    }
    @action
    requestRedRush = async (RecordID) => {
        try {
            await requestRedRush({
                'RecordID': RecordID
            });
            await this.getList();
        } catch (err) {
            message.error(err.message);
            console.log(err);
        }
    }



}
