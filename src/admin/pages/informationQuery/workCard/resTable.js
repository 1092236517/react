import placeholderImg1 from 'ADMIN_ASSETS/images/placeholderImg-1.png';
import authority from 'ADMIN_COMPONENTS/Authority';
import ossConfig from 'ADMIN_CONFIG/ossConfig';
import resId from 'ADMIN_CONFIG/resId';
import { Table } from 'antd';
import { inject, observer } from "mobx-react";
import React, { Component, Fragment } from 'react';
import { tableDateTimeRender, tableWorkCardAuditStsRender } from 'ADMIN_UTILS/tableItemRender';
import ImageView from './showImage';
import ModifyModal from './modifyModal';
import { generateColInfo } from 'ADMIN_UTILS';

const IMG_PATH = ossConfig.getImgPath();

@inject('workCardStore', 'globalStore')
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

	ModifyWorkCard = (no, id, url, EntId) => {
		this.props.workCardStore.ModifyWorkCard(no, id, url, EntId);
	}

	render() {
		const { workCardAuditModal } = this.props.workCardStore; // 公用的
		const { view, handleModifyReset } = this.props.workCardStore; // 公用的
		const { modifyVisible, modalLoading } = view;
		const columnsMap = [
			['RealName', '姓名', undefined, 100],
			['IdCardNum', '身份证号', undefined, 150],
			['Mobile', '手机号码', undefined, 120],
			['EntShortName', '用户上传企业名'],
			['WorkCardNo', '工号', (text, record) => {
				if (record.AuditSts === 2) {
					return (
						<Fragment>
							<span>{text}</span>
							{
								authority(resId.workCardList.modifyWorkAuth)(<a style={{ display: 'block' }} onClick={() => { this.ModifyWorkCard(text, record.UserWorkCardAuditId, record.WorkCardUrl, record.EntId); window._czc.push(['_trackEvent', '工牌信息查询', '修改', '工牌信息查询_Y结算']); }}>修改</a>)
							}
						</Fragment>
					);
				}
			}],
			['WorkCardUrl', '工牌照片', (text, record) => {
				if (!text) {
					return <img style={{ width: "84px", height: "46px" }} src={placeholderImg1} />;
				}
				return <div onClick={() => this.showImage(text)}><img style={{ width: "74px", height: "46px" }} src={IMG_PATH + text} /></div>;
			}],
			['UploadTime', '上传时间', tableDateTimeRender, 150],
			['AuditSts', '审核状态', tableWorkCardAuditStsRender, 80
				// (text, record) =>{
				// 	let UserWorkCardAuditId = record.UserWorkCardAuditId;
				// 	return(
				// 		text == 2 ? <a onClick={() => workCardAuditModal(UserWorkCardAuditId, 'auditVisible', 1)}>通过</a> : (text == 1 ? '未审核' : '未通过')
				// 	);
				// }
			],
			['AuditBy', '审核人', undefined, 100],
			['AuditTm', '审核时间', tableDateTimeRender, 150],
			// ['AuditRemark', '审核备注'],
			['IsDeleted32', '审核', (text, record) => {
				let UserWorkCardAuditId = record.UserWorkCardAuditId;
				if (record.AuditSts === 1 && record.RealName && record.IdCardNum) {
					// if (record.InterViewEntShortNme !== "") {
					return (authority(resId.workCardList.audit)(<a href='javascript:;' onClick={() => { workCardAuditModal(UserWorkCardAuditId, 'auditVisible', 2); window._czc.push(['_trackEvent', '工牌信息查询', '审核', '工牌信息查询_Y结算']); }}>审核</a>));
					// }
				} else { return; }
			}, 80]
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
				<ModifyModal
					workCardStore={this.props.workCardStore}
					{
					...{
						modifyVisible,
						modalLoading,
						handleModifyReset
					}}
				/>
			</div>
		);
	}
}

export default ResTable;