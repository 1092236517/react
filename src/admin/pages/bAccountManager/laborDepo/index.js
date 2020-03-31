import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';
import ResTable from './resTable';
import SearchForm from './searchForm';
import OperBtn from './operBtn';
import ResLable from './resLable';


@tabWrap({
    tabName: '劳务押金表',
    stores: ['laborDepoStore']
})
@inject('laborDepoStore', 'globalStore')
@observer
class Index extends Component {
    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/bAccountManager/laborDepo']);
        if (!this.props.laborDepoStore.view.isDirty) {
            this.init();
        }
    }

    init() {
        const { hasAllCompanyInfo, getAllCompanyInfo } = this.props.globalStore;
        const { startQuery, view: { bossList }, getBossList } = this.props.laborDepoStore;

        !hasAllCompanyInfo && getAllCompanyInfo();
        bossList.length == 0 && getBossList();
        startQuery();
    }

    render() {
        const {
            laborDepoStore: {
                view: { searchValue, tableInfo, pagination, bossList, attachInfo, BossListData },
                startQuery,
                exportRecord,
                handleFormValuesChange,
                resetForm,
                setPagination,
                resetPageCurrent,
                editRecord,
                refresh
            },
            globalStore: {
                companyList, laborList
            }
        } = this.props;
        console.log('attachInfo', attachInfo);

        return (
            <div>
                <OperBtn {...{ exportRecord, refresh }} />

                <SearchForm {...{ searchValue, handleFormValuesChange, resetForm, companyList, laborList, startQuery, resetPageCurrent, bossList }} />

                <ResLable {...attachInfo} />

                <ResTable {...{ tableInfo, pagination, setPagination, editRecord, BossListData }} />
            </div>
        );
    }
}

export default Index;


