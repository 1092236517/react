import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';
import ResTable from './resTable';
import SearchForm from './searchForm';
import DownTips from './downTips';

@tabWrap({
    tabName: '筛选会员费用明细',
    stores: ['memberImpDetailStore']
})

@inject('memberImpDetailStore', 'globalStore')
@observer
class Index extends Component {
    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/settleMgr/memberImpDetail']);
        if (!this.props.memberImpDetailStore.view.isDirty) {
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
            memberImpDetailStore: {
                view: { searchValue, tableInfo, pagination, ImportFile },
                handleFormValuesChange,
                resetForm,
                startQuery,
                resetPageCurrent,
                setImportFile,
                importPreview,
                exportImpXPre              
            },
            globalStore: {
                companyList, laborList
            }
        } = this.props;

        return (
            <div>
                <DownTips />
                <SearchForm {...{ searchValue, ImportFile, onValuesChange: handleFormValuesChange, resetForm, startQuery, resetPageCurrent, companyList, 
                laborList, setImportFile, importPreview, exportImpXPre }} />
                <ResTable {...{ tableInfo, pagination, startQuery, resetPageCurrent }} />
            </div>
        );
    }
}

export default Index;