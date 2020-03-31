import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';
import ResTable from './resTable';
import ResLable from './resLable';
import SearchForm from './searchForm';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import { Button } from 'antd';
@tabWrap({
    tabName: '返费预测表',
    stores: ['rebateForecastReportStore']
})
@inject('rebateForecastReportStore', 'globalStore')
@observer
class Index extends Component {
    componentDidMount() {
        this.props.history.listen((location, action) => {
            window._czc.push(['_trackPageview', location.pathname, window.location.href]);
        });
        this.init();
    }

    init() {
        const { hasAllCompanyInfo, getAllCompanyInfo } = this.props.globalStore;
        const {
            startQuery
        } = this.props.rebateForecastReportStore;
        if (!hasAllCompanyInfo) {
            getAllCompanyInfo();
        }
        //    startQuery();
    }

    render() {
        const {
            view: {
                searchValue,
                tableInfo,
                pagination
            },
            handleFormValuesChange,
            startQuery,
            resetPageCurrent,
            setPagination,
            resetForm,
            exportRecord
        } = this.props.rebateForecastReportStore;
        const { companyList, laborList } = this.props.globalStore;
        return (
            <div>
                {authority(resId.rebateForecastReport.exportX)(<Button style={{ marginBottom: 10 }} type="primary" onClick={() => { exportRecord(); window._czc.push(['_trackEvent', '返费预测表', '导出', '返费预测表_N非结算']); }}>导出</Button>)}
                <SearchForm {...{
                    companyList,
                    laborList,
                    searchValue,
                    handleFormValuesChange,
                    resetForm,
                    startQuery,
                    resetPageCurrent
                }} />
                <ResLable {...{ tableInfo }} />
                <ResTable {...{ pagination, tableInfo, startQuery, setPagination }} />
            </div>
        );
    }
}

export default Index;