import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';
import ResTable from './resTable';
import SearchForm from './searchForm';
import { Button } from 'antd';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';

@tabWrap({
    tabName: '导入周薪记录',
    stores: ['weeklyWageImportRecordStore']
})
@inject('weeklyWageImportRecordStore', 'globalStore')
@observer
export default class extends Component {
    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/weeklyWageManager/importRecord']);
        if (!this.props.weeklyWageImportRecordStore.view.isDirty) {
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
        const { exportRecord, view: { schedulerID } } = this.props.weeklyWageImportRecordStore;

        const { exportX } = resId.weeklyWageManager.importRecord;

        return (
            <div>
                {authority(exportX)(<Button type='primary' loading={schedulerID != ''} className='mb-16' onClick={() => { exportRecord(); window._czc.push(['_trackEvent', '导入周薪记录', '导出', '导入周薪记录_Y结算']); }}>导出</Button>)}
                <SearchForm {...this.props} />
                <ResTable {...this.props} />
            </div >
        );
    }
}