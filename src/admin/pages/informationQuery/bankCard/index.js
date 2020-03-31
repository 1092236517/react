import React, { Component } from 'react';
import { toJS } from 'mobx';
import { inject, observer } from "mobx-react";
import { Button } from 'antd';
import { tabWrap } from 'ADMIN_PAGES';

import SearchForm from './searchForm';
import ResTable from './resTable';
import AuditBankCardModal from './auditBankCardModal';
import UsableModal from './usableModal';
import UnusableModal from './unusableModal';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';

@tabWrap({
	tabName: '银行卡信息查询',
	stores: ['bankCardStore']
})
@inject('bankCardStore', 'globalStore')

@observer
class bankCard extends Component {
	componentDidMount(state) {
		window._czc.push(['_trackPageview', '/admin/informationQuery/bankCard']);
		if (state && state.refresh || !this.props.bankCardStore.view.isDirty) {
			this.init();
			this.props.bankCardStore.getBankList();
			this.getBankList();
		}
	}

	init() {
		const { hasAllCompanyInfo, getAllCompanyInfo } = this.props.globalStore;
		if (!hasAllCompanyInfo) {
			getAllCompanyInfo();
		}
		this.props.bankCardStore.startQuery();
	}

	getBankList = this.props.globalStore.getBankList;

	render() {
		const { view, setPagination,
			startQuery, handleFormValuesChange, resetPageCurrent, exportRecord } = this.props.bankCardStore; // 公用的
		const { tableInfo, searchValue, pagination, auditValue } = view; // 搜索条件
		const { dataList, total, UnAuditRecordCount, dataLoading } = tableInfo;
		const { current, pageSize } = pagination;
		const { bankList } = this.props.globalStore;
		return (
			<div className="id-card">
				{authority(resId.bankCardList.export)(<Button type='primary' disabled={dataList.length < 1} onClick={() => { exportRecord(); window._czc.push(['_trackEvent', '银行卡信息查询', '导出', '银行卡信息查询_Y结算']); }}>导出</Button>)}
				<SearchForm
					bankCardStore={this.props.bankCardStore}
					{...{
						auditValue,
						searchValue,
						handleFormValuesChange,
						startQuery,
						resetPageCurrent
					}} />
				<div className='mb-16 color-danger'>
					剩余待审核信息：{UnAuditRecordCount}条。
				</div>
				<ResTable
					bankCardStore={this.props.bankCardStore}
					bankList={bankList}
					bordered={true}
					dataSource={toJS(dataList)}
					rowKey='UserBankCardAuditId'
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
				<AuditBankCardModal	{...this.props} />
				<UsableModal />
				<UnusableModal />
			</div>
		);
	}
}

export default bankCard;