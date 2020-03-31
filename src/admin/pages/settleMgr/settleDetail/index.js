import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';
import ResTable from './resTable';
import SearchForm from './searchForm';
import OperBtn from './operBtn';
import ResLable from './resLable';

@tabWrap({
    tabName: 'ZX结算明细',
    stores: ['settleDetailStore']
})

@inject('settleDetailStore', 'globalStore')
@observer
class Index extends Component {
    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/settleMgr/settleDetail']);
        if (!this.props.settleDetailStore.view.isDirty) {
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
            settleDetailStore: {
                view: { searchValue, tableInfo, pagination, attachInfo },
                handleFormValuesChange,
                resetForm,
                startQuery,
                setPagination,
                resetPageCurrent
            },
            globalStore: {
                companyList, laborList
            }
        } = this.props;

        return (
            <div>
                {
                    /*
                    <OperBtn
                    showModal={this.showModal}
                    hideModal={this.hideModal} />
                    */
                }

                <SearchForm {...{ searchValue, handleFormValuesChange, resetForm, startQuery, setPagination, resetPageCurrent, companyList, laborList }} />

                {
                    <ResLable {...attachInfo} />
                }
                
                <ResTable {...{ tableInfo, pagination, setPagination }} />
            </div>
        );
    }
}

export default Index;