import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';
import { Button } from 'antd';
import ResTable from './resTable';
import SearchForm from './searchForm';
import InfoModal from './infoModal';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';

@tabWrap({
    tabName: '银行付款账号管理',
    stores: ['bankPayAccountStore']
})
@inject('bankPayAccountStore')
@observer
export default class extends Component {
    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/basicData/intermediaryAgent']);
        if (!this.props.bankPayAccountStore.view.isDirty) {
            this.init();
        }
    }

    init() {
        this.props.bankPayAccountStore.startQuery();
    }

    render() {
        const {
            view: {
                infoModal: { show }
            },
            setInfoModalShow,
            saveData,
            switchAccountSts
        } = this.props.bankPayAccountStore;
        const { disableAccountX, enableAccountX, addAccountX } = resId.basicData.bankPayAccount;

        return (
            <div>
                <div className='mb-16'>
                    {authority(addAccountX)(<Button type='primary' onClick={() => { setInfoModalShow(true); window._czc.push(['_trackEvent', '银行付款账号管理', '新增', '银行付款账号管理_Y结算']); }}>新增</Button>)}
                    {authority(disableAccountX)(<Button className='ml-8' onClick={() => { switchAccountSts(false); window._czc.push(['_trackEvent', '银行付款账号管理', '停用', '银行付款账号管理_Y结算']); }}>停用</Button>)}
                    {authority(enableAccountX)(<Button className='ml-8' onClick={() => { switchAccountSts(true); window._czc.push(['_trackEvent', '银行付款账号管理', '启用', '银行付款账号管理_Y结算']); }}>启用</Button>)}
                </div>

                <SearchForm {...this.props} />
                <ResTable {...this.props} />

                {show ? <InfoModal {...this.props} /> : null}
            </div >
        );
    }
}