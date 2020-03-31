import { observable, action } from "mobx";
import { message } from 'antd';
import { BaseView, BaseViewStore } from "../BaseViewStore";
import { queryWorkCardInfoList, workCardInfoListExport, getNextWorkCardPic, auditWorkCard} from 'ADMIN_SERVICE/ZXX_informationQuery';
import { ModifyWorkCardNo } from 'ADMIN_SERVICE/ZXX_Audit';

export class View extends BaseView {
	@observable searchValue = {
		AuditSts: -9999,
		EntId: -9999,
		IdCardNum: '',
		// IsExitPic: '',
		Mobile: '',
		RealName: '',
		UploadTimeBegin: null,
        UploadTimeEnd: null,
		WorkCardNo: ''
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
	@observable aduitType = null;
	@observable UserWorkCardAuditId = null;
	@observable workCardInfo = {};
	@observable auditVisible = false;
	@observable isEditor =true;

	@observable modifyVisible = false; // 初始修改框是隐藏的
	@observable UserWorkCardAuditId = ''; // 工牌审核Id
	@observable WorkCardNo = ''; // 工号
	@observable WorkCardUrl = ''; // 图片

	@observable ModifyWorkCardNoAndEntId = {
		WorkCardNo: '',
		EntId: null
	};
}

export default class extends BaseViewStore {
	@action
	handleFormValuesChange = (values) => {
		this.view.searchValue = values;
	}

	@action
	startQuery = async (callBack) => {
		const view = this.view;
		const { AuditSts, IdCardNum, Mobile, RealName, EntId,
			UploadTime, WorkCardNo, UploadTimeBegin, UploadTimeEnd } = view.searchValue;
		const { current, pageSize } = view.pagination;
		view.tableInfo.dataLoading = true;

		let reqParam = {
			SequenceUploadTime: 1,
			RecordIndex: (current - 1) * pageSize,
			RecordSize: pageSize
		};
        EntId ? reqParam.EntId = EntId : '';
		AuditSts ? reqParam.AuditSts = AuditSts : '';
		IdCardNum ? reqParam.IdCardNum = IdCardNum : '';
		Mobile ? reqParam.Mobile = Mobile : '';
		RealName ? reqParam.RealName = RealName : '';
		UploadTimeBegin ? reqParam.UploadTimeBegin = UploadTimeBegin.format('YYYY-MM-DD') : '';
		UploadTimeEnd ? reqParam.UploadTimeEnd = UploadTimeEnd.format('YYYY-MM-DD') : '';
		WorkCardNo ? reqParam.WorkCardNo = WorkCardNo : '';
		try {
			let resData = await queryWorkCardInfoList(reqParam);
			if (!resData.Data) return;

			view.tableInfo = {
				dataList: resData.Data.RecordList || [],
				dataLoading: false,
				total: resData.Data.RecordCount,
				UnAuditRecordCount: resData.Data.UnAuditRecordcount
			};

			view.accountInfo = {
				totalBalance: resData.Data.TotalBalance,
				totalCount: resData.Data.RecordCount
			};
			
			if (typeof callBack == 'function') {
				callBack(view.tableInfo.dataList);
			}

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

	// 弹窗,修改工牌信息
	workCardAuditModal = async (UserWorkCardAuditId, visible, aduitType) => {
		this.view.isEditor = true;
		this.view.aduitType = aduitType;
		this.view.UserWorkCardAuditId = UserWorkCardAuditId;
		this.setVisible('auditVisible', true);
		this.view.tableInfo.dataList.map((item) => {
			if(item.UserWorkCardAuditId == UserWorkCardAuditId) {
				this.view.workCardInfo = item;
			}
		});
	}

	// 导出工牌信息列表
	@action
	exportRecord = async () => {
		const view = this.view;
		const { current, pageSize } = view.pagination;
		const { AuditSts, EntShortName, IsExistPic, Mobile, RealName, UploadTimeBegin, UploadTimeEnd, WorkCardNo } = view.searchValue;

		let reqParam = {
			SequenceUploadTime: 1,
			RecordIndex: 0,
			RecordSize: 5000
		};
		AuditSts ? reqParam.AuditSts = AuditSts : -9999;
		EntShortName ? reqParam.EntShortName = EntShortName : '';
		IsExistPic ? reqParam.IsExistPic = IsExistPic : -9999;
		Mobile ? reqParam.Mobile = Mobile : '';
		RealName ? reqParam.RealName = RealName : '';
		UploadTimeBegin ? reqParam.UploadTimeBegin = UploadTimeBegin.format('YYYY-MM-DD') : '';
		UploadTimeEnd ? reqParam.UploadTimeEnd = UploadTimeEnd.format('YYYY-MM-DD') : '';
		WorkCardNo ? reqParam.WorkCardNo = WorkCardNo : '';
		try {
			let resData = await workCardInfoListExport(reqParam);
			window.open(resData.Data.FileUrl);
			return resData;
		} catch (err) {
			message.error(err.message);
			console.log(err);
		}
	}

	// 工牌信息审核
	@action 
	handleWorkCardAudit = async(values) =>{
		let params = {
			UserWorkCardAuditId: this.view.UserWorkCardAuditId,
			...values, 
			InterViewEntId: this.view.workCardInfo.InterViewEntId
		};
		if (!values.SubmitEntId) {
			params = {
				...params, 
				SubmitEntId: this.view.workCardInfo.EntId
			};
		}
		try {
			await auditWorkCard(params);
			this.startQuery(this.continueCardAudit);
  
		} catch (err) {
			message.error(err.message);
			console.log(err);
		}
	}

	// 工牌图片看不清
	@action
	getNextWorkCardPic = async () => {
		try {
			await getNextWorkCardPic({ UserWorkCardAuditId: this.view.UserWorkCardAuditId });
			this.startQuery(this.continueCardAudit);

		} catch (err) {
			message.error(err.message);
			console.log(err);
		}
	}

	@action
	continueCardAudit = (records) => {
		let firstCanAudit = null;
		for (let record of records) {
			//	取第一条可审核记录，逻辑参考  resTable 中 该列的 render
			if (record.AuditSts === 1 && record.RealName && record.IdCardNum) {
				firstCanAudit = record.UserWorkCardAuditId;
				break;
			}
		}
		if (firstCanAudit) {
			this.workCardAuditModal(firstCanAudit);
		} else {
			this.setVisible('auditVisible', false);
		}
	}


	@action
	handleFormReset = () => {
		this.view.resetProperty('workCardInfo');
		this.view.auditVisible = false;
	}

	@action
	changeIsEditor = (flag) =>{
		this.view.isEditor = flag;
	}

	@action
	changeEnt = (id, value) => {
		this.view.workCardInfo.EntId = id;
		this.view.workCardInfo.EntShortName = value;
	}

	// 清空查询条件
	@action
	handleSearchForm = () =>{
		this.view.resetProperty('searchValue');
	}

	// 修改银行卡信息
	@action
	ModifyWorkCard = (no, userId, WorkCardUrl, EntId) => {
		this.view.ModifyWorkCardNoAndEntId.WorkCardNo = no;
		this.view.ModifyWorkCardNoAndEntId.EntId = EntId;
		this.view.modifyVisible = !this.view.modifyVisible;
		this.view.WorkCardNo = no;
		this.view.UserWorkCardAuditId = userId;
		this.view.WorkCardUrl = WorkCardUrl;
	}

	// 修改
	@action
	handleModifyData = async (val) => {
		try {
			let query = {};
			query.WorkCardNo = val.WorkCardNo;
			query.EntId = val.EntId;
			query.UserWorkCardAuditId = this.view.UserWorkCardAuditId;
			let resData = await ModifyWorkCardNo(query);
			this.setVisible('modifyVisible', false);
			this.startQuery();
			this.view.WorkCardNo = '';
			this.view.UserWorkCardAuditId = '';
			return resData;
		} catch (err) {
			message.error(err.message);
		}
	}

	@action
	handleModifyReset = () => {
		this.setVisible('modifyVisible', false);
	}

	@action
	EntIdAndWorkNoChange = (values) => {
		this.view.ModifyWorkCardNoAndEntId = values;
	}

}