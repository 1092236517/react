import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';

import ResTable from './resTable';
import SearchForm from './searchForm';
import DownTips from './downTips';
import { Spin } from 'antd';

@tabWrap({
    tabName: '导入周薪',
    stores: ['weeklyWageImportStore']
})
@inject('weeklyWageImportStore', 'globalStore')
@observer
class WeeklyWageImport extends Component {
    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/weeklyWageManager/import']);
        if (!this.props.weeklyWageImportStore.view.isDirty) {
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
        const { view: { showSpin } } = this.props.weeklyWageImportStore;
        return (
            <div>
                <Spin spinning={showSpin}>
                    <DownTips />
                    <SearchForm {...this.props} />
                    <ResTable {...this.props} />
                </Spin>
            </div>
        );
    }
}

export default WeeklyWageImport;