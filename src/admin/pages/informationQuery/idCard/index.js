import React, { Component } from 'react';
import { Button } from 'antd';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';
import { toJS } from 'mobx';

import SearchForm from './searchForm';
import ResTable from './resTable';
import AuditModal from './auditModal';
import ReviseModal from './reviseModal';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';

@tabWrap({
	tabName: '身份证信息查询',
	stores: ['idCardStore']
})
@inject('idCardStore', 'globalStore')

@observer
class idCard extends Component {
	componentDidMount(state) {
		window._czc.push(['_trackPageview', '/admin/informationQuery/idCard']);
		if (state && state.refresh || !this.props.idCardStore.view.isDirty) {
			this.init();
		}
	}

	init() {
		const { hasAllCompanyInfo, getAllCompanyInfo } = this.props.globalStore;
		if (!hasAllCompanyInfo) {
			getAllCompanyInfo();
		}
		this.props.idCardStore.startQuery();
	}

	render() {
		const { view, setPagination, startQuery, handleFormValuesChange, resetPageCurrent,
			handleRevise, exportRecord, handleFormResetSeach, handleIdCardAudit, handleGetNextIDCardPic,
			handleIDFormReset } = this.props.idCardStore; // 公用的
		const { tableInfo, searchValue, auditValue, reviseValue, pagination, iDCardInfo, disableAudit, auditIdCardVisible, modalLoading, auditNameAndId } = view; // 搜索条件
		const { dataList, total, UnAuditRecordCount, dataLoading } = tableInfo;
		const { current, pageSize } = pagination;
		return (
			<div className="id-card">
				{authority(resId.idCardList.export)(<Button type='primary' disabled={dataList.length < 1} onClick={() => { exportRecord(); window._czc.push(['_trackEvent', '身份证信息查询', '导出', '身份证信息查询_Y结算']); }}>导出</Button>)}
				<SearchForm
					{...{
						handleFormResetSeach,
						searchValue,
						handleFormValuesChange,
						startQuery,
						resetPageCurrent
					}} />
				<div className='mb-16 color-danger'>
					剩余待审核信息：{UnAuditRecordCount}条。
				</div>
				<ResTable
					bordered={true}
					dataSource={toJS(dataList)}
					rowKey='UserIdcardAuditId'
					pagination={{
						...tablePageDefaultOpt,
						current,
						pageSize,
						total: total,
						onShowSizeChange: (current, size) => {
							setPagination(current, size);
						},
						onChange: (page, pageSize) => {
							setPagination(page, pageSize);
						}
					}}
					loading={dataLoading}
					refreshData={startQuery} />

				<AuditModal
					idCardStore={this.props.idCardStore}
					{...{
						modalLoading,
						handleIdCardAudit,
						handleGetNextIDCardPic,
						handleIDFormReset,
						auditIdCardVisible,
						disableAudit,
						iDCardInfo,
						auditValue,
						auditNameAndId,
						handleFormValuesChange,
						startQuery,
						resetPageCurrent
					}} />
				<ReviseModal
					{...{
						reviseValue,
						handleFormValuesChange,
						startQuery,
						resetPageCurrent,
						handleRevise
					}} />
			</div>
		);
	}
}

export default idCard;