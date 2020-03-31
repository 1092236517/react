import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';
import ResTable from './resTable';
import SearchForm from './searchForm';
import { Button } from 'antd';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';

@tabWrap({
    tabName: '打卡统计',
    stores: ['clockStatisticStore']
})
@inject('clockStatisticStore', 'globalStore')
@observer
export default class extends Component {
    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/clockInManager/clockStatistic']);
        if (!this.props.clockStatisticStore.view.isDirty) {
            this.init();
        }
    }

    init() {
        const { hasAllCompanyInfo, getAllCompanyInfo } = this.props.globalStore;
        if (!hasAllCompanyInfo) {
            getAllCompanyInfo();
        }
    }

    render() {
        const {
            view: { searchValue, tableInfo },
            exportRecord,
            handleFormValuesChange,
            startQuery,
            resetForm
        } = this.props.clockStatisticStore;
        const { companyList } = this.props.globalStore;

        const { exportX } = resId.clockInManager.clockStatistic;

        return (
            <div>
                {authority(exportX)(<Button type='primary' onClick={() => { exportRecord(); window._czc.push(['_trackEvent', '打卡统计', '导出', '打卡统计_Y结算']); }} className='mb-16'>导出</Button>)}
                <SearchForm {...{ searchValue, handleFormValuesChange, startQuery, resetForm, companyList }} />
                <ResTable {...{ tableInfo }} />
            </div >
        );
    }
}