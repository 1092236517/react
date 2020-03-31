import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';

import SearchFrom from './searchForm';
import ResTable from './resTable';

@tabWrap({
    tabName: '周薪补发',
    stores: ['weeklyWageReissueStore']
})
@inject('weeklyWageReissueStore', 'globalStore')
@observer
class WeeklyWageReissue extends Component {
    componentDidMount() {
        if (!this.props.weeklyWageReissueStore.view.isDirty) {
            this.init();
            window._czc.push(['_trackPageview', '/admin/weeklyWageManager/reissue']);
        }
    }

    init() {
        const { hasAllCompanyInfo, getAllCompanyInfo } = this.props.globalStore;
        if (!hasAllCompanyInfo) {
            getAllCompanyInfo();
        }
    }

    render() {
        return (
            <div>
                <SearchFrom {...this.props} />
                <ResTable {...this.props} />
            </div>
        );
    }
}

export default WeeklyWageReissue;