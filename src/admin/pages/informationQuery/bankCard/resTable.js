import placeholderImg1 from 'ADMIN_ASSETS/images/placeholderImg-1.png';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import { Table } from 'antd';
import { observer } from "mobx-react";
import React, { Component, Fragment } from 'react';
import { tableBank3keyCheckResultRender, tableBankCardAuditStsRender, tableDateMinutesRender, tableIsUserDeleteRender } from 'ADMIN_UTILS/tableItemRender';
import AuditModal from './auditModal';
import ImageView from './showImage';
import ModifyModal from './modifyModal';
import { generateColInfo } from 'ADMIN_UTILS';

@observer
class ResTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			imageView: false,
			imageSource: ''
		};
	}

	IdCardAuditModal = (data, record) => {
		this.props.bankCardStore.IdCardAuditModal(data, record);
	}

	manualCall = (values) => {
		this.props.bankCardStore.ManualCall(values);
	}
	// 查看图片
	showImage = (value) => {
		this.setState({
			imageSource: value,
			imageView: true
		});
	}
	setModal1Visible = () => {
		this.setState({
			imageSource: '',
			imageView: false
		});
	}

	// 修改银行卡信息
	ModifyBankCard = (name, userId, id, BankCardUrl) => {
		this.props.bankCardStore.ModifyBankCard(name, userId, id, BankCardUrl);
	}

	render() {
		const { bankCardAuditModal, handleUnusable, handleUsable, view, handleIdCardAudit, handleGetNextIDCardPic, handleIDFormReset, handleModifyReset, refresh } = this.props.bankCardStore; // 公用的
		const { modifyVisible, auditIdCardVisible, modalLoading } = view;
		const columnsMap = [
			['RealName', '姓名', (text, record) => {
				let params = {
					UserIdcardAuditId: record.UserIdcardAuditId
				};
				if (record.IdcardFrontUrl && record.IdCardAuditSts === 1) {
					return (authority(resId.bankCardList.auditIdCard)(<a href='javascript:;' onClick={() => { this.IdCardAuditModal(params, record); window._czc.push(['_trackEvent', '银行卡信息查询', '审核身份证', '银行卡信息查询_Y结算']); }}>审核身份证</a>));
				}
				return record.RealName;
			}, 100],
			['IdCardNum', '身份证号', undefined, 150],
			['Mobile', '手机号码', undefined, 120],
			['BankName', '银行名称', undefined, 160],
			['BankCardNum', '银行卡号', (text, record) => {
				if (record.AuditSts !== 1) {
					return (
						<Fragment>
							<span>{text}</span>
							{
								record.AuditSts === 2 &&
								(authority(resId.bankCardList.modifyAuth)(<a onClick={() => { this.ModifyBankCard(record.BankName, record.UserBankCardAuditId, text, record.BankCardUrl); window._czc.push(['_trackEvent', '银行卡信息查询', '修改银行卡号', '银行卡信息查询_Y结算']); }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;修改</a>))
							}
						</Fragment>
					);
				}
			}, 200],
			['BankCardUrl', '银行卡照片', (text, record) => {
				if (!record.IdcardFrontUrl) {
					return <img style={{ width: "84px", height: "46px" }} src={placeholderImg1} alt="银行卡照片" />;
				}
				return <div onClick={() => this.showImage(text)}><img style={{ width: "84px", height: "46px" }} src={text} /></div>;
			}],
			['AreaName', '地区', (text, { ProvinceName, CityName, AreaName }) => (`${ProvinceName}-${CityName}-${AreaName}`), 170],
			['UploadTime', '上传时间', tableDateMinutesRender, 150],
			['IsUserDelete', '是否删除', tableIsUserDeleteRender, 80],
			['DeleteReason', '删除原因', undefined, 230],
			['AuditSts', '审核状态', tableBankCardAuditStsRender, 80],
			['AuditBy', '审核人'],
			['AuditTm', '审核时间', tableDateMinutesRender, 150],
			// ['AuidtRemark', '审核备注'], 
			['Bank3keyCheckResult', '接口调用状态', tableBank3keyCheckResultRender],
			['Bank3keyCheckRemark', '调用说明'],
			['Bank3keyAvlSts', '是否可用', (text, record) => {
				let UserBankCardAuditId = record.UserBankCardAuditId;
				// 0: '未知', 1: '不可用', 2: '可用'
				if (record.Bank3keyAvlSts === 0) {
					return '未知';
				} else if (record.Bank3keyAvlSts === 1) {
					return <a href='javascript:;' onClick={() => handleUnusable(UserBankCardAuditId, 'unusableVisible', true)}>不可用</a>;
				} else {
					return <a href='javascript:;' onClick={() => handleUsable(UserBankCardAuditId, 'usableVisible', true)}>可用</a>;
				}
			}, 80],
			['Bank3keyRemark', '不可用原因'],
			['ManualCertification', '手动调用', (text, record) => {
				return (record.Bank3keyAvlSts == 1 || record.Bank3keyCheckResult == 3) && <a href='javascript:;' onClick={() => this.manualCall({ UserBankCardAuditId: record.UserBankCardAuditId })}>手动调用</a>;
			}],
			['IsDeleted32', '操作', (text, record) => {
				if ((record.AuditSts === 1 && record.IdCardAuditSts === 2 && record.IsUserDelete === 1) || (record.IdCardAuditSts === 2 && record.Bank3keyAvlSts === 1 && record.IsUserDelete === 1)) {
					return (
						<Fragment>
							{
								authority(resId.bankCardList.audit)(<a href='javascript:;' onClick={() => { bankCardAuditModal(record.UserBankCardAuditId); window._czc.push(['_trackEvent', '银行卡信息查询', '审核', '银行卡信息查询_Y结算']); }}>审核&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a>)
							}
							{
								authority(resId.bankCardList.refresh)(<a href='javascript:;' onClick={() => { refresh(record.UserBankCardAuditId); window._czc.push(['_trackEvent', '银行卡信息查询', '刷新', '银行卡信息查询_Y结算']); }}>刷新</a>)
							}

						</Fragment>
					);
				}
			}, undefined, 'right']
		];

		const [columns, width] = generateColInfo(columnsMap);

		let { imageSource, imageView } = this.state;

		return (
			<div>
				<Table
					scroll={{ x: width, y: 550 }}
					columns={columns}
					{...this.props} >
				</Table>
				<AuditModal
					bankCardStore={this.props.bankCardStore}
					{...{
						auditIdCardVisible,
						modalLoading,
						handleIdCardAudit,
						handleGetNextIDCardPic,
						handleIDFormReset
					}}
				/>
				{
					imageView &&
					<ImageView setModal1Visible={this.setModal1Visible.bind(this)} imageView source={imageSource} />
				}
				<ModifyModal
					bankCardStore={this.props.bankCardStore}
					bankList={this.props.bankList}
					{...{
						modifyVisible,
						modalLoading,
						handleIdCardAudit,
						handleGetNextIDCardPic,
						handleModifyReset
					}}
				/>
			</div>
		);
	}
}

export default ResTable;