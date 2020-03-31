import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';
import { Button } from 'antd';
import ResTable from './resTable';
import SearchForm from './searchForm';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
@tabWrap({
    tabName: '账单详情',
    stores: ['weekReturnFeeBillDetailStore']
})
@inject('weekReturnFeeBillDetailStore')
@observer
class WeeklyWageBillDetail extends Component {
    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/weekReturnFee/billDetail/:Id']);
        let { batchID, from } = this.props.match.params;
        const { setBatchID } = this.props.weekReturnFeeBillDetailStore;
        setBatchID(batchID || '');
        this.init();
    }

    init() {
        this.props.weekReturnFeeBillDetailStore.startQuery();
    }

    render() {
        const {
            view: {
                searchValue,
                tableInfo,
                pagination
            },
            exportRecord,
            startQuery,
            resetPageCurrent,
            handleFormValuesChange,
            setPagination,
            resetForm
        } = this.props.weekReturnFeeBillDetailStore;

        const { exportDetailX } = resId.weekReturnFee.bill;

        return (
            <div>
                {authority(exportDetailX)(<Button type='primary' className='mb-16' onClick={exportRecord}>导出</Button>)}
                <SearchForm {...{
                    startQuery,
                    resetPageCurrent,
                    handleFormValuesChange,
                    resetForm
                }} />
                <ResTable {...{
                    tableInfo,
                    pagination,
                    startQuery,
                    setPagination
                }} />
            </div>
        );
    }
}

export default WeeklyWageBillDetail;