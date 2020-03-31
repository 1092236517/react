import React, { Component } from 'react';
import { Button, message } from 'antd';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';
import ResTable from './resTable';
import ResLable from './resLable';
import SearchForm from './searchForm';

@tabWrap({
    tabName: 'zx盈利分析总报表',
    stores: ['profitAnalysisSummaryStore']
})
@inject('profitAnalysisSummaryStore', 'globalStore')
@observer
class Index extends Component {
    componentDidMount() {
        this.props.history.listen((location, action) => {
            window._czc.push(['_trackPageview', location.pathname]);
        });
        this.init();
    }

    init() {
        const { hasAllCompanyInfo, getAllCompanyInfo } = this.props.globalStore;
        const {
            startQuery
        } = this.props.profitAnalysisSummaryStore;
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
        } = this.props.profitAnalysisSummaryStore;
        const { companyList, laborList } = this.props.globalStore;

        return (
            <div>
                <SearchForm {...{
                    searchValue,
                    handleFormValuesChange,
                    companyList,
                    laborList,
                    resetForm,
                    startQuery,
                    resetPageCurrent,
                    exportRecord
                }} />
                <ResLable {...{ tableInfo }} />
                <ResTable {...{ pagination, tableInfo, startQuery, setPagination }} />
            </div>
        );
    }
}

export default Index;