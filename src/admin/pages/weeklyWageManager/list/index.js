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
    tabName: '周薪查询',
    stores: ['weeklyWageListStore']
})
@inject('weeklyWageListStore', 'globalStore')
@observer
class WeeklyWageList extends Component {
    componentDidMount() {
        const { weeklyWageListStore } = this.props;
        window._czc.push(['_trackPageview', '/admin/weeklyWageManager/list']);
        let extraParams = sessionStorage.getItem('TEMP_JUMP_PARAMS');
        if (extraParams) {
            weeklyWageListStore.handleFormReset();
            sessionStorage.removeItem('TEMP_JUMP_PARAMS');
            weeklyWageListStore.startQuery(JSON.parse(extraParams));
            return;
        }

        if (!weeklyWageListStore.view.isDirty) {
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
            exportSPAmount,
            handleFormValuesChange,
            startQuery,
            resetPageCurrent,
            setPagination,
            handleFormReset,
            view: { schedulerID1, schedulerID2, lableInfo, tableInfo, searchValue, pagination }
        } = this.props.weeklyWageListStore;
        const { agentList, companyList, laborList } = this.props.globalStore;
        const { exportX, exportSPAmountX } = resId.weeklyWageManager.list;

        return (
            <div>
                <div className='mb-16'>
                    {authority(exportX)(<Button type='primary' loading={schedulerID1 != ''} onClick={() => { exportRecord(); window._czc.push(['_trackEvent', '周薪查询', '导出', '周薪查询_Y结算']); }}>导出</Button>)}
                    {authority(exportSPAmountX)(<Button type='primary' loading={schedulerID2 != ''} onClick={() => { exportSPAmount(); window._czc.push(['_trackEvent', '周薪查询', '导出中介平台费', '周薪查询_Y结算']); }} className='ml-8' >导出中介平台费</Button>)}
                </div>

                <SearchForm {...{ tableInfo, agentList, companyList, laborList, searchValue, handleFormValuesChange, startQuery, resetPageCurrent, handleFormReset }} />

                <ResLable {...lableInfo} total={tableInfo.total} SrceFlag={searchValue.SrceFlag} />

                <ResTable {...{ tableInfo, pagination, startQuery, setPagination }} />
            </div>
        );
    }
}

export default WeeklyWageList;