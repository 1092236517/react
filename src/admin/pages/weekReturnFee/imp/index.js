import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';

import ResTable from './resTable';
import SearchForm from './searchForm';
import DownTips from './downTips';
import { Spin } from 'antd';

@tabWrap({
    tabName: '导入返费周薪',
    stores: ['weekReturnFeeImpStore']
})
@inject('weekReturnFeeImpStore', 'globalStore')
@observer
class WeeklyWageImport extends Component {
    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/weekReturnFee/imp']);
        if (!this.props.weekReturnFeeImpStore.view.isDirty) {
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
            importPreview,
            resetTableInfo,
            generateBatch,
            getFormatErrData,
            setImportFile,
            expPreview,
            handleFormValuesChange,
            agentList,
            joinBatchCountInAgent,
            totalCountInAgent,
            hanleJoinBatchState,
            switchAgent,
            view: { showSpin, tableVisible, importFile, searchValue, tableInfo, selectJoinState, selectAgentID }
        } = this.props.weekReturnFeeImpStore;
        const { companyList, laborList } = this.props.globalStore;

        return (
            <div>
                <Spin spinning={showSpin}>
                    <DownTips />
                    <SearchForm {...{
                        importFile,
                        searchValue,
                        companyList,
                        laborList,
                        importPreview,
                        resetTableInfo,
                        generateBatch,
                        getFormatErrData,
                        setImportFile,
                        expPreview,
                        tableVisible,
                        handleFormValuesChange
                    }} />
                    <ResTable {...{
                        tableInfo,
                        getFormatErrData,
                        tableVisible,
                        selectAgentID,
                        selectJoinState,
                        agentList,
                        joinBatchCountInAgent,
                        totalCountInAgent,
                        hanleJoinBatchState,
                        switchAgent
                    }} />
                </Spin>
            </div>
        );
    }
}

export default WeeklyWageImport;