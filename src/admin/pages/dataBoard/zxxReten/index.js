import React, { Component } from 'react';
import { Button, message } from 'antd';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';
import ResTable from './resTable';
import SearchForm from './searchForm';

@tabWrap({
    tabName: '留存率报表',
    stores: ['dataBoradZXXRetenStore']
})
@inject('dataBoradZXXRetenStore', 'globalStore')
@observer
class Index extends Component {
    componentDidMount() {
        window._czc.push(['_trackPageview', location.pathname, window.location.href]);
        if (!this.props.dataBoradZXXRetenStore.view.isDirty) {
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
            view: {
                searchValue,
                tableInfo
            },
            handleFormValuesChange,
            startQuery,
            setPagination,
            resetForm
        } = this.props.dataBoradZXXRetenStore;
        const { companyList, laborList } = this.props.globalStore;
        const { Days: days } = searchValue;

        return (
            <div>
                <SearchForm {...{
                    searchValue,
                    handleFormValuesChange,
                    companyList,
                    laborList,
                    resetForm,
                    startQuery
                }} />

                <ResTable {... {
                    tableInfo,
                    setPagination,
                    days
                }} />
            </div>
        );
    }
}

export default Index;