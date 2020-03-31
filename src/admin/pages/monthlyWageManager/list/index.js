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
    tabName: '月薪查询',
    stores: ['monthlyWageListStore']
})
@inject('monthlyWageListStore', 'globalStore')
@observer
class MonthlyWageList extends Component {
    componentDidMount() {
        const { monthlyWageListStore } = this.props;
        window._czc.push(['_trackPageview', '/admin/monthlyWageManager/list']);
        let extraParams = sessionStorage.getItem('TEMP_JUMP_PARAMS');
        if (extraParams) {
            sessionStorage.removeItem('TEMP_JUMP_PARAMS');
            monthlyWageListStore.startQuery(JSON.parse(extraParams));
            return;
        }

        if (!monthlyWageListStore.view.isDirty) {
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
            exportSPAmout,
            handleFormValuesChange,
            view: { schedulerID1, schedulerID2, lableInfo, searchValue, tableInfo, pagination },
            startQuery,
            resetPageCurrent,
            setPagination,
            handleFormReset
        } = this.props.monthlyWageListStore;
        const { agentList, companyList, laborList } = this.props.globalStore;
        const { exportX, exportSPAmoutX } = resId.monthlyWageManager.list;

        return (
            <div>
                <div className='mb-16'>
                    {authority(exportX)(<Button type='primary' loading={schedulerID1 != ''} onClick={() => { exportRecord(); window._czc.push(['_trackEvent', '月薪查询', '导出', '月薪查询_Y结算']); }}>导出</Button>)}
                    {authority(exportSPAmoutX)(<Button type='primary' loading={schedulerID2 != ''} className='ml-8' onClick={() => { exportSPAmout(); window._czc.push(['_trackEvent', '月薪查询', '导出平台费', '月薪查询_Y结算']); }}>导出平台费</Button>)}
                </div>

                <SearchForm {...{ lableInfo, tableInfo, agentList, companyList, laborList, searchValue, handleFormValuesChange, startQuery, resetPageCurrent, handleFormReset }} />

                <ResLable {...lableInfo} total={tableInfo.total} />

                <ResTable {...{ tableInfo, pagination, setPagination }} />
            </div>
        );
    }
}

export default MonthlyWageList;