import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import { tabWrap } from 'ADMIN_PAGES';
import { Button } from 'antd';
import { inject, observer } from "mobx-react";
import React, { Component } from 'react';
import ResTable from './resTable';
import SearchForm from './searchForm';

@tabWrap({
    tabName: '在职天数查询',
    stores: ['workingDaysStore']
})
@inject('workingDaysStore', 'globalStore')
@observer
export default class extends Component {
    componentDidMount() {
        window._czc.push(['_trackPageview', location.pathname, window.location.href]);
        if (!this.props.workingDaysStore.view.isDirty) {
            this.init();
        }
    }

    init() {
        const { hasAllCompanyInfo, getAllCompanyInfo } = this.props.globalStore;
        this.props.workingDaysStore.startQuery();
        if (!hasAllCompanyInfo) {
            getAllCompanyInfo();
        }
    }

    render() {
        const { view: { TolInWorkDays } } = this.props.workingDaysStore;

        return (
            <div>
                <SearchForm {...this.props} />
                <div className='mb-16'>
                    <div className='color-danger'>总在职天数：{TolInWorkDays} 天</div>
                </div>
                <ResTable {...this.props} />
            </div>
        );
    }
}