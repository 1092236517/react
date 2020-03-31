import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';
import { Button } from 'antd';
import ResTable from './resTable';
import SearchForm from './searchForm';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
@tabWrap({
    tabName: '周薪账单详情',
    stores: ['weeklyWageBillDetailStore']
})
@inject('weeklyWageBillDetailStore')
@observer
class WeeklyWageBillDetail extends Component {
    componentDidMount() {
        let { batchID, from } = this.props.match.params;
        const { setBatchID, setFrom } = this.props.weeklyWageBillDetailStore;
        setBatchID(batchID || '');
        setFrom(from || '');
        this.init();
        window._czc.push(['_trackPageview', '/admin/weeklyWageManager/bill/:Id']);
    }

    init() {
        this.props.weeklyWageBillDetailStore.startQuery();
    }

    render() {
        const { exportRecord } = this.props.weeklyWageBillDetailStore;

        const { exportX } = resId.weeklyWageManager.billDetail;

        return (
            <div>
                {authority(exportX)(<Button type='primary' className='mb-16' onClick={() => { exportRecord(); window._czc.push(['_trackEvent', '周薪账单详情', '导出', '周薪账单详情_Y结算']); }}>导出</Button>)}
                <SearchForm {...this.props} />
                <ResTable {...this.props} />
            </div>
        );
    }
}

export default WeeklyWageBillDetail;