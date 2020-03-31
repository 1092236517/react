import React, { Component } from 'react';
import { Button, message } from 'antd';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';
import ResTable from './resTable';
import SearchForm from './searchForm';

@tabWrap({
    tabName: '报到率入职率',
    stores: ['rateOfRetentionAndRegisterStore']
})
@inject('rateOfRetentionAndRegisterStore', 'globalStore')
@observer
class Index extends Component {
    componentDidMount() {
        if (!this.props.rateOfRetentionAndRegisterStore.view.isDirty) {
            window._czc.push(['_trackPageview', location.pathname, window.location.href]);
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
        } = this.props.rateOfRetentionAndRegisterStore;
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