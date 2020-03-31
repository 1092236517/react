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
    tabName: '中介打款虚拟子账户',
    stores: ['agentPayAccountStore']
})
@inject('agentPayAccountStore', 'globalStore')
@observer
export default class extends Component {
    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/basicData/agentPayAccount']);
        if (!this.props.agentPayAccountStore.view.isDirty) {
            this.init();
        }
    }

    init() {
        const { hasAllCompanyInfo, getAllCompanyInfo, bankPayAccountList, getAllBankPayAcct } = this.props.globalStore;
        if (!hasAllCompanyInfo) {
            getAllCompanyInfo();
        }

        if (bankPayAccountList.length == 0) {
            getAllBankPayAcct();
        }
        
        this.props.agentPayAccountStore.startQuery();
    }

    render() {
        const {
            view: {
                infoModal: { show }
            },
            setInfoModalShow
        } = this.props.agentPayAccountStore;
        const { addAccountX } = resId.basicData.agentPayAccount;

        return (
            <div>
                <div className='mb-16'>
                {authority(addAccountX)(<Button type='primary' onClick={() => { setInfoModalShow(true); window._czc.push(['_trackEvent', '中介打款虚拟子账户', '新增', '中介打款虚拟子账户_N非结算']); }}>新增</Button>)}
                </div>

                <SearchForm {...this.props} />
                <ResTable {...this.props} />

                {show ? <InfoModal {...this.props} /> : null}
            </div >
        );
    }
}