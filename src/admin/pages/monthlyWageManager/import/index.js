import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';

import ResTable from './resTable';
import SearchForm from './searchForm';
import DownTips from './downTips';
import { Spin } from 'antd';

@tabWrap({
    tabName: '导入月薪',
    stores: ['monthlyWageImportStore']
})
@inject('monthlyWageImportStore', 'globalStore')
@observer
class MonthlyWageImport extends Component {
    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/monthlyWageManager/import']);
        if (!this.props.monthlyWageImportStore.view.isDirty) {
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
        const { view: { showSpin } } = this.props.monthlyWageImportStore;
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

export default MonthlyWageImport;