import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';
import ResTable from './resTable';
import SearchForm from './searchForm';
import OperBtn from './operBtn';

@tabWrap({
    tabName: '返费报表',
    stores: ['rtnFeeReportStore']
})

@inject('rtnFeeReportStore', 'globalStore')
@observer
class Index extends Component {
    componentDidMount() {
        if (!this.props.rtnFeeReportStore.view.isDirty) {
            this.init();
        }
    }

    init() {
        const { hasAllCompanyInfo, getAllCompanyInfo } = this.props.globalStore;
        if (!hasAllCompanyInfo) {
            getAllCompanyInfo();
        }

        const { startQuery } = this.props.rtnFeeReportStore;
        startQuery();
    }

    render() {
        const {
            rtnFeeReportStore: {
                view: { searchValue, tableInfo, pagination },
                startQuery,
                handleFormValuesChange,
                resetForm,
                setPagination,
                exportRecord,
                resetPageCurrent
            },
            globalStore: {
                companyList, laborList
            }
        } = this.props;

        return (
            <div>
                <OperBtn exportRecord={exportRecord} />

                <SearchForm {...{ searchValue, handleFormValuesChange, resetForm, companyList, laborList, startQuery, resetPageCurrent }} />

                <ResTable {...{ tableInfo, pagination, setPagination }} />
            </div>
        );
    }
}

export default Index;