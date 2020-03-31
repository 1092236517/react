import { observable, action } from "mobx";
import { message } from 'antd';
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { queryIDCardInfoList, iDCardInfoListExport, auditIDCard, getNextIDCardPic } from 'ADMIN_SERVICE/ZXX_informationQuery';
import { CmsIdCardQuery } from 'ADMIN_SERVICE/ZXX_Audit';
import getClient from 'ADMIN_COMPONENTS/AliyunUpload/getClient';
import uploadRule from 'ADMIN_CONFIG/uploadRule';

export class View extends BaseView {
	@observable searchValue = {
		AuditSts: -9999,
		IdCardNum: '',
		Mobile: '',
		RealName: '',
		RegTimeBegin: null,
        RegTimeEnd: null
	}

	@observable auditValue = {
		Realname: '',
		IdCardNum: '',
		UserIdcardAuditId: ''
	}

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
	@observable disableAudit = false;
	@observable auditIdCardVisible = false;
	@observable reviseIdCardVisible = false;
	@observable modalLoading = false;
	@observable iDCardInfo = {
		IdcardFrontUrl: null,
        RealName: null,
		IdCardNum: null
	};

	@observable auditNameAndId = {
		Realname: '',
		IdCardNum: ''
	}
}

export default class extends BaseViewStore {
	@action
	handleFormValuesChange = (values) => {
		this.view.searchValue = values;
	}

	// 查询身份证信息列表
	@action
	startQuery = async (callBack) => {
		const view = this.view;
		const { AuditSts, IdCardNum, Mobile, RealName, RegTimeBegin, RegTimeEnd} = view.searchValue;
		const { current, pageSize } = view.pagination;
		view.tableInfo.dataLoading = true;

		let reqParam = {
			SequenceUploadTime: 1,
			RecordIndex: (current - 1) * pageSize,
			RecordSize: pageSize
		};

		AuditSts ? reqParam.AuditSts = AuditSts : '';
		IdCardNum ? reqParam.IdCardNum = IdCardNum : '';
		Mobile ? reqParam.Mobile = Mobile : '';
		RealName ? reqParam.RealName = RealName : '';
		RegTimeBegin ? reqParam.RegTimeBegin = RegTimeBegin.format('YYYY-MM-DD') : '';
		RegTimeEnd ? reqParam.RegTimeEnd = RegTimeEnd.format('YYYY-MM-DD') : '';
		try {
			let resData = await queryIDCardInfoList(reqParam);
			// if (!resData.Data) return;
			let RecordList = resData.Data.RecordList;
			getClient(uploadRule.idCardPic).then(data => {
				RecordList.map((item) => {
					item.IdcardFrontUrl = data.signatureUrl(item.IdcardFrontUrl);
				});
				view.tableInfo = {
					dataList: RecordList || [],
					dataLoading: false,
					total: resData.Data.RecordCount,
					UnAuditRecordCount: resData.Data.UnAuditRecordCount
				};
				view.accountInfo = {
					totalBalance: resData.Data.TotalBalance,
					totalCount: resData.Data.RecordCount
				};

				if (typeof callBack == 'function') {
					callBack(RecordList);
				}
			}).catch((err) => {
				view.tableInfo.dataLoading = false;
				message.error(err.message);
			});
		} catch (err) {
			view.tableInfo.dataLoading = false;
			message.error(err.message);
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

	// 弹窗,审核身份证信息
	@action
	IdCardAuditModal = async (value) => {
		this.view.auditValue.UserIdcardAuditId = value.UserIdcardAuditId;
		this.view.auditNameAndId.RealName = value.RealName;
		this.view.auditNameAndId.IdCardNum = value.IdCardNum;
		this.setVisible('auditIdCardVisible', true);
		this.view.tableInfo.dataList.forEach(item => {
			if (item.UserIdcardAuditId === value.UserIdcardAuditId) {
				this.view.iDCardInfo = item;
				this.view.disableAudit = false;
				return;
			}
		});
	}

	// 弹窗,修改身份证信息
	@action
	IdCardReviseModal = async (value) => {
		this.view.auditValue.UserIdcardAuditId = value.UserIdcardAuditId;
		this.setVisible('reviseIdCardVisible', true);
		this.view.tableInfo.dataList.forEach(item => {
			if (item.UserIdcardAuditId === value.UserIdcardAuditId) {
				this.view.iDCardInfo = item;
				this.view.disableAudit = this.view.iDCardInfo.BankCardAuditSts == 2 ? true : false; // 通过不修改，其它可以修改
				return;
			}
		});
	}

	// 身份证信息审核
	@action
	handleIdCardAudit = async (values) => {
		this.view.modalLoading = true;
		let params = {
			IdCardNum: values.IdCardNum,
			RealName: values.RealName,
			UserIdcardAuditId: Number.parseInt(this.view.auditValue.UserIdcardAuditId, 10)
		};
		try {
			await auditIDCard(params);
			message.success('身份证信息审核成功');
			this.startQuery(this.continueCardAudit);
		} catch (err) {
			this.setVisible('auditIdCardVisible', false);
			this.startQuery();
			message.error(err.Desc);
		}
		this.view.modalLoading = false;
	}

	// 刷新
	@action
	refresh = async (id) => {
		this.view.modalLoading = true;
		let param = {
			UserIdcardAuditId: id
		};
		try {
			await CmsIdCardQuery(param);
			message.success('刷新成功');
			this.startQuery();
		} catch (err) {
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
			if (record.IdcardFrontUrl && record.AuditSts == 1) {
				firstCanAudit = {
					RealName: record.RealName,
					IdCardNum: record.IdCardNum,
					UserIdcardAuditId: record.UserIdcardAuditId,
					auditIdCardVisible: true
				};
				break;                  
			}
		}
		if (firstCanAudit) {
			this.IdCardAuditModal(firstCanAudit);
		} else {
			this.setVisible('auditIdCardVisible', false);
		}
	}

	// 身份证信息修改
	@action
	handleIdCardRevise = async (values) => {
		this.view.modalLoading = true;
		let params = {
			IdCardNum: values.IdCardNum,
			RealName: values.RealName,
			UserIdcardAuditId: Number.parseInt(this.view.auditValue.UserIdcardAuditId, 10)
		};
		try {
			await auditIDCard(params);
			message.success('身份证信息修改成功');
			this.setVisible('reviseIdCardVisible', false);
			this.startQuery();
		} catch (err) {
			message.error(err.Desc);
		}
		this.view.modalLoading = false;
	}

	// 身份证图片看不清
	@action
	handleGetNextIDCardPic = async () => {
		let params = {
			UserIdcardAuditId: Number.parseInt(this.view.auditValue.UserIdcardAuditId, 10)
		};
		try {
			await getNextIDCardPic(params);
			this.startQuery(this.continueCardAudit);

		} catch (err) {
			message.error(err.message);
		}
	}

	// 导出身份证信息列表
	@action
	exportRecord = async () => {
		const view = this.view;
		const { current, pageSize } = view.pagination;
		const { RegTime, RealName, AuditSts, IdCardNum, Mobile, RegTimeBegin, RegTimeEnd } = view.searchValue;

		let reqParam = {
			SequenceUploadTime: 1,
			RecordIndex: 0,
			RecordSize: 5000
		};
		AuditSts ? reqParam.AuditSts = AuditSts : '';
		IdCardNum ? reqParam.IdCardNum = IdCardNum : '';
		Mobile ? reqParam.Mobile = Mobile : '';
		RealName ? reqParam.RealName = RealName : '';
		RegTimeBegin ? reqParam.RegTimeBegin = RegTimeBegin.format('YYYY-MM-DD') : '';
		RegTimeEnd ? reqParam.RegTimeEnd = RegTimeEnd.format('YYYY-MM-DD') : '';

		try {
			let resData = await iDCardInfoListExport(reqParam);
			window.open(resData.Data.FileUrl);
			return resData;
		} catch (err) {
			message.error(err.message);
		}
	}

	@action
	handleIDFormReset = () => {
		this.view.resetProperty('iDCardInfo');
		this.view.auditIdCardVisible = false;
	}

	@action
	handleReviseFormReset = () => {
		this.view.resetProperty('iDCardInfo');
		this.view.reviseIdCardVisible = false;
	}

	@action
	handleFormResetSeach = () =>{
		this.view.resetProperty('searchValue');
	}

	@action
	ModalValuesChange = (values) => {
		this.view.auditNameAndId = values;
	}

	@action
	ModalReset = () =>{
		this.view.resetProperty('auditNameAndId');
	}

}
