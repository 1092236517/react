import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';

import ResTable from './resTable';
import SearchForm from './searchForm';
import DownTips from './downTips';
import { Spin } from 'antd';

@tabWrap({
    tabName: '银行卡信息拉取',
    stores: ['bankCardExmportStore']
})
@inject('bankCardExmportStore', 'globalStore')
@observer
class WeeklyWageImport extends Component {
    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/informationQuery/bankCarfExmport']);
        if (!this.props.bankCardExmportStore.view.isDirty) {
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
        const { view: { showSpin } } = this.props.bankCardExmportStore;
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