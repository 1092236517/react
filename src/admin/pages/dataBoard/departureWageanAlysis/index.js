import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';
import ResTable from './resTable';
import SearchForm from './searchForm';

@tabWrap({
    tabName: '自离工资分析报表',
    stores: ['departureWageanAlysisStore']
})
@inject('departureWageanAlysisStore', 'globalStore')
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
        } = this.props.departureWageanAlysisStore;
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
        } = this.props.departureWageanAlysisStore;
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
                <ResTable {...{ pagination, tableInfo, startQuery, setPagination }} />
            </div>
        );
    }
}

export default Index;