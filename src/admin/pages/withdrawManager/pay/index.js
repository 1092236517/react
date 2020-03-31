import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';
import { Button } from 'antd';
import ResTable from './resTable';
import SearchForm from './searchForm';
import ResLabel from './resLabel';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';

@tabWrap({
    tabName: '发薪',
    stores: ['withdrawManagerPayStore']
})

@inject('withdrawManagerPayStore', 'globalStore')
@observer
class WeeklyWageBill extends Component {
    componentDidMount() {
        const { withdrawManagerPayStore } = this.props;
        window._czc.push(['_trackPageview', '/admin/withdrawManager/pay']);
        let extraParams = sessionStorage.getItem('TEMP_JUMP_PARAMS');
        if (extraParams) {
            sessionStorage.removeItem('TEMP_JUMP_PARAMS');
            withdrawManagerPayStore.startQuery(JSON.parse(extraParams));
            return;
        }

        if (!withdrawManagerPayStore.view.isDirty) {
            this.init();
        }
    }

    init() {
        this.props.withdrawManagerPayStore.startQuery();
        this.props.globalStore.getAllCompanyInfo();
    }

    render() {
        const {
            view: {
                attachInfo,
                schedulerID,
                searchValue,
                tableInfo,
                pagination
            },
            withDrawPay,
            exportRecord,
            handleFormValuesChange,
            startQuery,
            resetPageCurrent,
            handleFormReset,
            setPagination,
            setSelectRowKeys
        } = this.props.withdrawManagerPayStore;
        const { companyList, laborList } = this.props.globalStore;

        const { withDrawPayX, exportX } = resId.withdrawManager.pay;
        return (
            <div>
                <div className='mb-16'>
                    {authority(withDrawPayX)(<Button type='primary' style={{ position: 'fixed', top: 120, zIndex: 9999 }} onClick={() => { withDrawPay(); window._czc.push(['_trackEvent', '发薪', '打款', '发薪_Y结算']); }}>打款</Button>)}
                    {authority(exportX)(<Button type='primary' loading={schedulerID != ''} style={{ marginLeft: 80 }} onClick={() => { exportRecord(); window._czc.push(['_trackEvent', '发薪', '导出', '发薪_Y结算']); }}>导出</Button>)}
                </div>

                <SearchForm {...{ handleFormValuesChange, searchValue, startQuery, resetPageCurrent, setSelectRowKeys, laborList, companyList, handleFormReset }} />

                <ResLabel {...{ attachInfo }} />

                <ResTable {...{ tableInfo, pagination, setPagination, setSelectRowKeys, startQuery }} />
            </div>
        );
    }
}

export default WeeklyWageBill;