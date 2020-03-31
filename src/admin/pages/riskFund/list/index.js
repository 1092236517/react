import React, { Component } from 'react';
import { Button } from 'antd';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';
import ResTable from './resTable';
import SearchForm from './searchForm';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';

@tabWrap({
    tabName: '返费风险金',
    stores: ['riskFundStore']
})
@inject('riskFundStore', 'globalStore')
@observer
class WeeklyWageList extends Component {
    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/riskFund/list']);
        const { riskFundStore } = this.props;
        if (!riskFundStore.view.isDirty) {
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
            exportRecord,
            handleFormValuesChange,
            startQuery,
            resetPageCurrent,   
            setPagination,
            handleFormReset,
            view: { tableInfo, searchValue, pagination }
        } = this.props.riskFundStore;
        const { agentList, companyList, laborList } = this.props.globalStore;
        const { exportX } = resId.riskFund.list;

        return (
            <div>
                <div className='mb-16'>
                    {authority(exportX)(<Button type='primary' onClick={() => { exportRecord(); window._czc.push(['_trackEvent', '返费风险金', '导出', '返费风险金_Y结算']); }}>导出</Button>)}
                </div>

                <SearchForm {...{ agentList, companyList, laborList, searchValue, handleFormValuesChange, startQuery, resetPageCurrent, handleFormReset }} />

                <ResTable {...{ tableInfo, pagination, startQuery, setPagination }} />
            </div>
        );
    }
}

export default WeeklyWageList;