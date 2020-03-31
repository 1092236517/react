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
    tabName: '退回列表',
    stores: ['withdrawManagerBackStore']
})
@inject('withdrawManagerBackStore')
@observer
class WeeklyWageBill extends Component {
    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/withdrawManager/back']);
        if (!this.props.withdrawManagerBackStore.view.isDirty) {
            this.init();
        }
    }

    init() {
        this.props.withdrawManagerBackStore.startQuery();
    }

    render() {
        const { view: { attachInfo }, withDrawRePay, destroyBankBack, exportRecord } = this.props.withdrawManagerBackStore;

        const { withDrawRePayX, destroyBankBackX, exportX } = resId.withdrawManager.back;

        return (
            <div>
                <div className='mb-16'>
                    {authority(withDrawRePayX)(<Button type='primary' onClick={() => { withDrawRePay(); window._czc.push(['_trackEvent', '退回列表', '申请重发', '退回列表_Y结算']); }}>申请重发</Button>)}
                    {authority(destroyBankBackX)(<Button type='primary' className='ml-8' onClick={() => { destroyBankBack(); window._czc.push(['_trackEvent', '退回列表', '作废', '退回列表_Y结算']); }}>作废</Button>)}
                    {authority(exportX)(<Button type='primary' className='ml-8' onClick={() => { exportRecord(); window._czc.push(['_trackEvent', '退回列表', '导出', '退回列表_Y结算']); }}>导出</Button>)}
                </div>

                <SearchForm {...this.props} />
                <ResLabel {
                    ...{
                        attachInfo
                    }
                } />
                <ResTable {...this.props} />
            </div>
        );
    }
}

export default WeeklyWageBill;

