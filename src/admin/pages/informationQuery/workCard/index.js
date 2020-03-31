import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import { tabWrap } from 'ADMIN_PAGES';
import { Button } from 'antd';
import { toJS } from 'mobx';
import { inject, observer } from "mobx-react";
import React, { Component } from 'react';
import AuditModal from './auditModal';
import ResTable from './resTable';
import SearchForm from './searchForm';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';


@tabWrap({
	tabName: '工牌信息查询',
	stores: ['workCardStore']
})
@inject('workCardStore', 'globalStore')

@observer
class idCard extends Component {
	componentDidMount(state) {
		window._czc.push(['_trackPageview', '/admin/informationQuery/workCard']);
		if (state && state.refresh || !this.props.workCardStore.view.isDirty) {
			this.init();
		}
	}


	init() {
		const { hasAllCompanyInfo, getAllCompanyInfo } = this.props.globalStore;
		if (!hasAllCompanyInfo) {
			getAllCompanyInfo();
		}
		this.props.workCardStore.startQuery();
	}

	render() {
		const { view, modalVisible, setPagination,
			startQuery, handleFormValuesChange, resetPageCurrent, handleAudit, exportRecord, setVisible } = this.props.workCardStore; // 公用的
		const { tableInfo, searchValue, pagination, auditValue, isEditor, workCardInfo, aduitType, modalLoading, auditVisible } = view; // 搜索条件
		const { dataList, total, UnAuditRecordCount, dataLoading } = tableInfo;
		const { current, pageSize } = pagination;
		return (
			<div className="id-card">
				{authority(resId.workCardList.export)(<Button type='primary' disabled={dataList.length < 1} onClick={() => { exportRecord(); window._czc.push(['_trackEvent', '工牌信息查询', '导出', '工牌信息查询_Y结算']); }}>导出</Button>)}
				<SearchForm
					companyList={this.props.globalStore.companyList}
					workCardStore={this.props.workCardStore}
					{...{
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
					rowKey='UserWorkCardAuditId'
					pagination={{
						...tablePageDefaultOpt,
						current,
						pageSize,
						total,
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
					workCardStore={this.props.workCardStore}
					{...{
						auditVisible,
						modalLoading,
						aduitType,
						workCardInfo,
						isEditor,
						auditValue,
						setVisible,
						handleFormValuesChange,
						startQuery,
						resetPageCurrent,
						handleAudit
					}} />
			</div>
		);
	}
}

export default idCard;