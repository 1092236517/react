import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';

import SearchFrom from './searchForm';
import ResTable from './resTable';

@tabWrap({
    tabName: '补发返费周薪',
    stores: ['weekReturnFeeReissueStore']
})
@inject('weekReturnFeeReissueStore', 'globalStore')
@observer
class WeeklyWageReissue extends Component {
    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/weekReturnFee/reissue']);
        if (!this.props.weekReturnFeeReissueStore.view.isDirty) {
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
                tableVisible,
                tableInfo
            },
            handleFormValuesChange,
            showNewTable,
            delRecord,
            commitData,
            editRecord,
            resetOldTable
        } = this.props.weekReturnFeeReissueStore;
        const { companyList, laborList, getLaborText, getCompanyText } = this.props.globalStore;

        return (
            <div>
                <SearchFrom {...{
                    searchValue,
                    tableVisible,
                    handleFormValuesChange,
                    showNewTable,
                    companyList,
                    laborList
                }} />

                <ResTable {...{
                    tableInfo,
                    delRecord,
                    searchValue,
                    tableVisible,
                    commitData,
                    editRecord,
                    resetOldTable,
                    getLaborText,
                    getCompanyText 
                }} />
            </div>
        );
    }
}

export default WeeklyWageReissue;