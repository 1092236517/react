import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';
import ResTable from './resTable';
import SearchForm from './searchForm';

@tabWrap({
    tabName: '月薪已发设置',
    stores: ['monthyWagePaySetStore']
})
@inject('monthyWagePaySetStore', 'globalStore')
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
        } = this.props.monthyWagePaySetStore;
        if (!hasAllCompanyInfo) {
            getAllCompanyInfo();
        }
        startQuery();
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
            exportRecord,
            updataRowRecord
        } = this.props.monthyWagePaySetStore;
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
                <ResTable {...{ pagination, tableInfo, startQuery, setPagination, searchValue, updataRowRecord }} />
            </div>
        );
    }
}

export default Index;