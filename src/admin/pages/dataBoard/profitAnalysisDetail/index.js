import React, { Component } from 'react';
import { Button, message } from 'antd';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';
import ResTable from './resTable';
import SearchForm from './searchForm';
import DetailModal from './detailModal';
@tabWrap({
    tabName: 'zx盈利分析明细表',
    stores: ['profitAnalysisDetailStore']
})
@inject('profitAnalysisDetailStore', 'globalStore')
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
        } = this.props.profitAnalysisDetailStore;
        if (!hasAllCompanyInfo) {
            getAllCompanyInfo();
        }
        //   startQuery();
    }

    render() {
        const {
            view: {
                searchValue,
                tableInfo,
                pagination,
                synchVisible,
                synchVisibleValue,
                exportButContro
            },
            handleFormValuesChange,
            startQuery,
            resetPageCurrent,
            setPagination,
            resetForm,
            exportRecord,
            setSynchVisible,
            setSynchVisibleValue
        } = this.props.profitAnalysisDetailStore;
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
                    exportRecord,
                    resetPageCurrent,
                    exportButContro
                }} />
                <ResTable {...{ pagination, tableInfo, startQuery, setPagination, setSynchVisible, setSynchVisibleValue }} />
                <DetailModal {...{ synchVisible, setSynchVisible, synchVisibleValue }} />
            </div>
        );
    }
}

export default Index;