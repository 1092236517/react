import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';
import { Button } from 'antd';
import ResTable from './resTable';
import SearchForm from './searchForm';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';

@tabWrap({
    tabName: '月薪账单详情',
    stores: ['monthlyWageBillDetailStore']
})
@inject('monthlyWageBillDetailStore')
@observer
class MonthlyWageBillDetail extends Component {
    componentDidMount() {
        let batchID = this.props.match.params.MonthBatchId;
        this.props.monthlyWageBillDetailStore.setBatchID(batchID);
        this.init();
    }

    init() {
        this.props.monthlyWageBillDetailStore.startQuery();
    }

    render() {
        const { exportRecord } = this.props.monthlyWageBillDetailStore;

        const { exportX } = resId.monthlyWageManager.billDetail;

        return (
            <div>
                {authority(exportX)(<Button type='primary' className='mb-16' onClick={exportRecord}>导出</Button>)}
                <SearchForm {...this.props} />
                <ResTable {...this.props} />
            </div>
        );
    }
}

export default MonthlyWageBillDetail;