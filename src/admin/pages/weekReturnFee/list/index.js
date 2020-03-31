import React, { Component } from 'react';
import { Button } from 'antd';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';
import ResTable from './resTable';
import SearchForm from './searchForm';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import ResLable from './resLable';

@tabWrap({
    tabName: '返费周薪查询',
    stores: ['weekReturnFeeListStore']
})
@inject('weekReturnFeeListStore', 'globalStore')
@observer
class WeeklyWageList extends Component {
    componentDidMount() {
        const { weekReturnFeeListStore } = this.props;
        window._czc.push(['_trackPageview', '/admin/weekReturnFee/list']);
        if (!weekReturnFeeListStore.view.isDirty) {
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
        const {
            exportRecord,
            handleFormValuesChange,
            startQuery,
            resetPageCurrent,
            setPagination,
            handleFormReset,
            view: { schedulerID1, schedulerID2, lableInfo, tableInfo, searchValue, pagination }
        } = this.props.weekReturnFeeListStore;
        const { agentList, companyList, laborList } = this.props.globalStore;
        const { exportX } = resId.weekReturnFee.list;

        return (
            <div>
                <div className='mb-16'>
                    {authority(exportX)(<Button type='primary' loading={schedulerID1 != ''} onClick={()=>{exportRecord(); window._czc.push(['_trackEvent', '返费周薪查询', '导出', '返费周薪查询_N非结算']);}}>导出</Button>)}
                </div>

                <SearchForm {...{ agentList, companyList, laborList, searchValue, handleFormValuesChange, startQuery, resetPageCurrent, handleFormReset }} />

                <ResLable {...lableInfo} total={tableInfo.total} />

                <ResTable {...{tableInfo, pagination, startQuery, setPagination}} />
            </div>
        );
    }
}

export default WeeklyWageList;