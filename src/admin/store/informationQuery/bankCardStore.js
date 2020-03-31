import { observable, action } from "mobx";
import { message } from 'antd';
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { queryBankCardInfoList, bankCardInfoListExport, modifyBankCardStatus, 
	auditBankCard, getNextBankCardPic, auditIDCard, getNextIDCardPic} from 'ADMIN_SERVICE/ZXX_informationQuery';
import {ModifyBankCardParam} from 'ADMIN_SERVICE/ZXX_Audit';
import { getBankList } from 'ADMIN_SERVICE/ZXX_SystemCfg';
import getClient from 'ADMIN_COMPONENTS/AliyunUpload/getClient';
import uploadRule from 'ADMIN_CONFIG/uploadRule';
import { CmsBankCardQuery } from 'ADMIN_SERVICE/ZXX_Audit';

export class View extends BaseView {
	@observable searchValue = {
		AuditSts: -9999,
		Bank3keyAvlSts: -9999,
		Bank3keyCheckResult: -9999,
		BankCardNum: '',
		BankName: null,
		IdCardNum: '',
		IsExistPic: '',
		Mobile: '',
		RealName: '',
		UploadTimeBegin: null,
        UploadTimeEnd: null,
		IsUserDelete: -9999
	}

	@observable auditValue = {
		bankLists: [],
		UserBankCardAuditId: ''
	}

    @observable iDCardInfo = {}

	@observable pagination = {
		current: 1,
		pageSize: 10
	}

	@observable tableInfo = {
		dataList: [],
		dataLoading: false,
		total: 0,
		UnAuditRecordCount: 0
	};
	@observable bankCardInfo = [];
	@observable auditIdCardVisible = false;
	@observable auditBankCardVisible = false;
	@observable usableVisible = false;
	@observable unusableVisible = false;
	@observable modalLoading = false;
	@observable bankLists = []; // 银行卡列表
	@observable modifyBankValue = {};
	@observable modifyVisible = false; // 初始修改框是隐藏的
	@observable UserBankCardAuditId = ''; // 银行卡审核ID
	@observable BankName = ''; // 银行名称
	@observable BankCardNum = ''; // 银行卡号
	@observable BankCardUrl = ''; // 银行照片

}

export default class extends BaseViewStore {
	@action
	handleFormValuesChange = (values) => {
		this.view.searchValue = values;
	}
    // 获取银行卡列表信息
	@action
	getBankList = async() => {
         try {
			let resData = await getBankList();
			this.view.auditValue.bankLists = resData.Data.RecordList;
			return resData;
			} catch (err) {
				message.error(err.message);
			}
	}
	@action
	startQuery = async (callBack) => {
		const view = this.view;
		const { current, pageSize } = view.pagination;
		view.tableInfo.dataLoading = true;
		let reqParam = {
			SequenceUploadTime: 1,
			RecordIndex: (current - 1) * pageSize,
			RecordSize: pageSize
		};
		let { AuditSts, Bank3keyAvlSts, Bank3keyCheckResult, BankCardNum, BankName, IdCardNum, IsExistPic, Mobile, RealName, UploadTimeBegin, UploadTimeEnd, IsUserDelete} = view.searchValue;
		AuditSts ? (reqParam.AuditSts = AuditSts) : '';
		IsUserDelete ? (reqParam.IsUserDelete = IsUserDelete) : '';
		Bank3keyAvlSts ? reqParam.Bank3keyAvlSts = Bank3keyAvlSts : '';
		Bank3keyCheckResult ? reqParam.Bank3keyCheckResult = Bank3keyCheckResult : '';
		BankCardNum ? reqParam.BankCardNum = BankCardNum : '';
		BankName ? reqParam.BankName = BankName : '';
		IdCardNum ? reqParam.IdCardNum = IdCardNum : '';
		IsExistPic ? reqParam.IsExistPic = IsExistPic : '';
		Mobile ? reqParam.Mobile = Mobile : '';
		RealName ? reqParam.RealName = RealName : '';
		UploadTimeBegin ? reqParam.UploadTimeBegin = UploadTimeBegin.format('YYYY-MM-DD') : '';
		UploadTimeEnd ? reqParam.UploadTimeEnd = UploadTimeEnd.format('YYYY-MM-DD') : '';
		try {
			let resData = await queryBankCardInfoList(reqParam);
			if (!resData.Data) return;

			getClient(uploadRule.bankCardPic).then(data => {
				resData.Data.RecordList.forEach((item) => {
					item.BankCardUrl = data.signatureUrl(item.BankCardUrl);
					item.IdcardFrontUrl = data.signatureUrl(item.IdcardFrontUrl);
				});
				view.tableInfo = {
					dataList: resData.Data.RecordList || [],
					dataLoading: false,
					total: resData.Data.RecordCount,
					UnAuditRecordCount: resData.Data.UnAuditRecordCount
				};

				view.accountInfo = {
					totalBalance: resData.Data.TotalBalance,
					totalCount: resData.Data.RecordCount
				};

				if(typeof callBack == 'function') {
					callBack(view.tableInfo.dataList);
				}

			}).catch((err) => {
				view.tableInfo.dataLoading = false;
				message.error(err.message);
			});
			return resData;
		} catch (err) {
			view.tableInfo.dataLoading = false;
			message.error(err.message);
			console.log(err);
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

	// 设置弹窗的显示和隐藏
	@action
	setVisible = (visible, flag) => {
		this.view[visible] = flag;
	}

	// 银行卡信息审核-弹窗
	@action
	bankCardAuditModal = async (UserBankCardAuditId) => {
		this.view.auditValue.UserBankCardAuditId = UserBankCardAuditId;
		this.view.modalLoading = true;
		this.setVisible('auditBankCardVisible', true);
		this.view.tableInfo.dataList.forEach(item => {
			if (item.UserBankCardAuditId === UserBankCardAuditId) {
				this.view.bankCardInfo = item;
				return;
			}
		});
		this.getBankList();
		this.view.modalLoading = false;
	}

	// 银行卡信息审核
	@action
	handleBankCardAudit = async (formValues) => {
		this.view.modalLoading = true;
		let params = {
			BankCardNum: formValues.BankCardNum,
			BankName: formValues.BankName ? formValues.BankName : this.view.bankCardInfo.BankName,
            UserBankCardAuditId: this.view.bankCardInfo.UserBankCardAuditId
		};
		try {
			await auditBankCard(params);
			message.success('银行卡信息审核成功');
			this.startQuery(this.continueCardAudit);
		} catch (err) {
			this.setVisible('auditBankCardVisible', false);
			this.startQuery();
			message.error(err.Desc);
		}
		this.view.modalLoading = false;
	}

	@action
	continueCardAudit = (records) => {
		let firstCanAudit = null;
		for (let record of records) {
			//	取第一条可审核记录，逻辑参考  resTable 中 该列的 render
			if ((record.AuditSts === 1 && record.IdCardAuditSts === 2 && record.IsUserDelete === 1) || (record.IdCardAuditSts === 2 && record.Bank3keyAvlSts === 1 && record.IsUserDelete === 1)) {
				firstCanAudit = record.UserBankCardAuditId;
				break;
			}
		}
		if (firstCanAudit) {
			this.bankCardAuditModal(firstCanAudit);
		} else {
			this.setVisible('auditBankCardVisible', false);
		}
	}

	// 刷新
	@action
	refresh = async (id) => {
		this.view.modalLoading = true;
		let param = {
			UserBankCardAuditId: id
		};
		try {
			await CmsBankCardQuery(param);
			message.success('刷新成功');
			this.startQuery();
		} catch (err) {
			this.startQuery();
			message.error(err.Desc);
		}
		this.view.modalLoading = false;
	}

	// 银行卡图片看不清
	@action
	handleGetNextBankCardPic = async () => {
		let params = {
			UserBankCardAuditId: this.view.auditValue.UserBankCardAuditId
		};
		try {
			await getNextBankCardPic(params);
			this.startQuery(this.continueCardAudit);
		} catch (err) {
			message.error(err.message);
		}
	}

	// 导出银行卡信息列表
	@action
	exportRecord = async () => {
		const view = this.view;
		const { current, pageSize } = view.pagination;
		const { AuditSts, Bank3keyAvlSts, Bank3keyCheckResult, BankCardNum, BankName, IdCardNum, IsExistPic,
			Mobile, RealName, UploadTimeBegin, UploadTimeEnd, IsUserDelete} = view.searchValue;

		let reqParam = {
			SequenceUploadTime: 1,
			RecordIndex: 0,
			RecordSize: 5000
		};
		AuditSts ? (reqParam.AuditSts = AuditSts) : '';
		IsUserDelete ? (reqParam.IsUserDelete = IsUserDelete) : '';
		Bank3keyAvlSts ? reqParam.Bank3keyAvlSts = Bank3keyAvlSts : '';
		Bank3keyCheckResult ? reqParam.Bank3keyCheckResult = Bank3keyCheckResult : '';
		BankCardNum ? reqParam.BankCardNum = BankCardNum : '';
		BankName ? reqParam.BankName = BankName : '';
		IdCardNum ? reqParam.IdCardNum = IdCardNum : '';
		IsExistPic ? reqParam.IsExistPic = IsExistPic : '';
		Mobile ? reqParam.Mobile = Mobile : '';
		RealName ? reqParam.RealName = RealName : '';
		UploadTimeBegin ? reqParam.UploadTimeBegin = UploadTimeBegin.format('YYYY-MM-DD') : '';
		UploadTimeEnd ? reqParam.UploadTimeEnd = UploadTimeEnd.format('YYYY-MM-DD') : '';

		try {
			let resData = await bankCardInfoListExport(reqParam);
			window.open(resData.Data.FileUrl);
			return resData;
		} catch (err) {
			message.error(err.message);
			console.log(err);
		}
	}

	// 是否可用-可用
	@action
	handleUsable = (UserBankCardAuditId) => {
		this.setVisible('usableVisible', true);
		this.view.tableInfo.dataList.forEach(item => {
			if (item.UserBankCardAuditId === UserBankCardAuditId) {
				this.view.modifyBankValue = item;
				return;
			}
		});
	}

	// 是否可用-不可用
	@action
	handleUnusable = (UserBankCardAuditId) => {
		this.setVisible('unusableVisible', true);
		this.view.tableInfo.dataList.forEach(item => {
			if (item.UserBankCardAuditId === UserBankCardAuditId) {
				this.view.modifyBankValue = item;
				return;
			}
		});
	}
	@action
	modifyBankCardStatus = async () => {
		let reqParam = {
			Bank3keyAvlSts: this.view.modifyBankValue.Bank3keyAvlSts == 1 ? 2 : 1,
			UserBankCardAuditId: this.view.modifyBankValue.UserBankCardAuditId
		};
		modifyBankCardStatus(reqParam).then((resData) => {
			message.success('修改成功！');
			this.startQuery();
			this.setVisible('usableVisible', false);
			this.setVisible('unusableVisible', false);
		}, (err) => {
			message.error(err.message);
		});
	}

	@action
	handleFormReset = () => {
		this.view.resetProperty('bankCardInfo');
		this.view.auditBankCardVisible = false;
	}

	// 手动调用
	@action
	ManualCall = async(params) => {
		try {
			await auditBankCard(params);
			message.success('银行卡信息审核成功');
			this.startQuery();
		} catch (err) {
			message.error(err.Desc);
		}
	}
	// 弹窗,审核身份证信息
	@action
	IdCardAuditModal = async (value, record) => {
		this.view.auditValue.UserIdcardAuditId = value.UserIdcardAuditId;
		this.view.iDCardInfo = record;
		this.setVisible('auditIdCardVisible', true);
	}

		// 身份证信息审核
	@action
	handleIdCardAudit = async (values) => {
		this.view.modalLoading = true;
		let params = {
			IdCardNum: values.IdCardNum,
			RealName: values.RealName,
			UserIdcardAuditId: this.view.auditValue.UserIdcardAuditId
		};
		try {
			await auditIDCard(params);
			message.success('身份证信息审核成功');
			this.setVisible('auditIdCardVisible', false);
			this.startQuery();
		} catch (err) {
			this.setVisible('auditIdCardVisible', false);
			this.startQuery();
			message.error(err.Desc);
		}
		this.view.modalLoading = false;
	}

		// 身份证图片看不清
	@action
	handleGetNextIDCardPic = async () => {
		let params = {
			UserIdcardAuditId: this.view.auditValue.UserIdcardAuditId
		};
		try {
			let resData = await getNextIDCardPic(params);
				this.setVisible('auditIdCardVisible', false);
			this.startQuery();
			return resData;
		} catch (err) {
			message.error(err.message);
		}
	}

	@action
	handleIDFormReset = () =>{
		this.view.resetProperty('iDCardInfo');
		this.setVisible('auditIdCardVisible', false);
	}
	// 清空查询条件
	@action
	handleSearchForm = () =>{
		this.view.resetProperty('searchValue');
	}

	// 修改银行卡信息
	@action
	ModifyBankCard = (name, userId, num, BankCardUrl) => {
		this.view.modifyVisible = !this.view.modifyVisible;
		this.view.BankCardNum = num;
		this.view.BankName = name;
		this.view.UserBankCardAuditId = userId;
		this.view.BankCardUrl = BankCardUrl;
	}

	// 修改
	@action
	handleModifyData = async (val) => {
		console.log(val, this.view.UserBankCardAuditId);
		try {
			let query = {};
			query.BankCardNum = val.BankCardNum;
			query.BankName = val.BankName;
			query.UserBankCardAuditId = this.view.UserBankCardAuditId;
			let resData = await ModifyBankCardParam(query);
			this.setVisible('modifyVisible', false);
			this.startQuery();
			this.view.BankCardNum = '';
			this.view.BankName = '';
			this.view.UserBankCardAuditId = '';
			return resData;
		} catch (err) {
			message.error(err.message);
		}
	}

	@action
	handleModifyReset = () => {
		this.setVisible('modifyVisible', false);
	}
	
}