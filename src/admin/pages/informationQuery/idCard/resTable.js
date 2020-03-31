import placeholderImg1 from 'ADMIN_ASSETS/images/placeholderImg-1.png';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import { Table } from 'antd';
import { inject, observer } from "mobx-react";
import React, { Component, Fragment } from 'react';
import { tableDateTimeRender, tableIdCardAuditStsRender } from 'ADMIN_UTILS/tableItemRender';
import ImageView from './showImage';
import { generateColInfo } from 'ADMIN_UTILS';


@inject('idCardStore', 'globalStore')
@observer
class ResTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			imageView: false,
			imageSource: ''
		};
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

	render() {
		const { IdCardAuditModal, IdCardReviseModal, refresh } = this.props.idCardStore; // 公用的
		const columnsMap = [
			['RealName', '姓名', (text, record) => {
				// if (record.AuditSts === 2) {
				// let params = {
				// 	UserIdcardAuditId: record.UserIdcardAuditId
				// };
				// return <a href='javascript:;' onClick={() => IdCardReviseModal(params)}>{record.RealName}</a>;
				return <span>{text}</span>;
				// }
			}, 100],
			['CreditScore', '萌芽信用', undefined, 150],
			['IdCardNum', '身份证号', undefined, 150],
			['Mobile', '手机号码', undefined, 120],
			['IdcardFrontUrl', '身份证照片', (text, record) => {
				if (!record.IdcardFrontUrl) {
					return <img style={{ width: "84px", height: "46px" }} src={placeholderImg1} alt="身份证照片" />;
				}
				return <div onClick={() => this.showImage(text)}><img style={{ width: "84px", height: "46px" }} src={text} /></div>;
			}],
			['RegTime', '上传时间', tableDateTimeRender, 150],
			['AuditSts', '审核状态', tableIdCardAuditStsRender, 80],
			['AuditBy', '审核人', undefined, 100],
			['AuditTm', '审核时间', tableDateTimeRender, 150],
			['AuditRemark', '审核备注'],
			['IsDeleted32', '操作', (text, record) => {
				if (record.AuditSts !== 1) {
					return tableIdCardAuditStsRender(text);
				} else {
					if (record.IdcardFrontUrl) {
						let params = {
							RealName: record.RealName,
							IdCardNum: record.IdCardNum,
							UserIdcardAuditId: record.UserIdcardAuditId,
							auditIdCardVisible: true
						};
						return (
							<Fragment>
								{
									authority(resId.idCardList.audit)(<a href='javascript:;' onClick={() => { IdCardAuditModal(params); window._czc.push(['_trackEvent', '身份证信息查询', '审核', '身份证信息查询_Y结算']); }}>审核&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a>)
								}
								{
									authority(resId.idCardList.refresh)(<a href='javascript:;' onClick={() => { refresh(record.UserIdcardAuditId); window._czc.push(['_trackEvent', '身份证信息查询', '刷新', '身份证信息查询_Y结算']); }}>刷新</a>)
								}

							</Fragment>
						);
					}
				}
			}, 100]
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
				{
					imageView &&
					<ImageView setModal1Visible={this.setModal1Visible.bind(this)} imageView source={imageSource} />
				}
			</div>
		);
	}
}

export default ResTable;