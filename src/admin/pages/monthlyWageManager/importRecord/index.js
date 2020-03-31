import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';
import ResTable from './resTable';
import SearchForm from './searchForm';
import { Button } from 'antd';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';

@tabWrap({
    tabName: '导入月薪记录',
    stores: ['monthlyWageImportRecordStore']
})
@inject('monthlyWageImportRecordStore', 'globalStore')
@observer
export default class extends Component {
    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/monthlyWageManager/importRecord']);
        if (!this.props.monthlyWageImportRecordStore.view.isDirty) {
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
        const { exportRecord } = this.props.monthlyWageImportRecordStore;

        const { exportX } = resId.monthlyWageManager.importRecord;

        return (
            <div>
                {authority(exportX)(<Button type='primary' onClick={() => { exportRecord(); window._czc.push(['_trackEvent', '导入月薪记录', '导出', '导入月薪记录_Y结算']); }}>导出</Button>)}
                <SearchForm {...this.props} />
                <ResTable {...this.props} />
            </div>
        );
    }
}