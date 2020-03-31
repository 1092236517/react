import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';
import ResTable from './resTable';
import SearchForm from './searchForm';
import OperBtn from './operBtn';
import ResLable from './resLable';
@tabWrap({
    tabName: '会员申请表',
    stores: ['rtnFeeMemberApplyStore']
})
@inject('rtnFeeMemberApplyStore', 'globalStore')
@observer
class Index extends Component {
    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/returnFee/memberApply']);
        if (!this.props.rtnFeeMemberApplyStore.view.isDirty) {
            this.init();
        }
    }

    init() {
        const { hasAllCompanyInfo, getAllCompanyInfo } = this.props.globalStore;
        const { startQuery } = this.props.rtnFeeMemberApplyStore;
        if (!hasAllCompanyInfo) {
            getAllCompanyInfo();
        }
        startQuery();
    }

    render() {
        const {
            rtnFeeMemberApplyStore: {
                view: { searchValue, tableInfo, pagination },
                startQuery,
                handleFormValuesChange,
                resetForm,
                setPagination,
                setSelectRowKeys,
                resetPageCurrent,
                exportRecord
            },
            globalStore: {
                companyList, laborList
            }
        } = this.props;

        return (
            <div>
                <OperBtn
                    selectedRowKeys={tableInfo.selectedRowKeys}
                    selectedRows={tableInfo.selectedRows}
                    reloadData={startQuery}
                    exportRecord={exportRecord} />

                <SearchForm {...{ searchValue, handleFormValuesChange, resetForm, companyList, laborList, startQuery, resetPageCurrent }} />
                <ResLable {...{ tableInfo }} total={tableInfo.total} />
                <ResTable {...{ tableInfo, pagination, setPagination, setSelectRowKeys, reloadData: startQuery }} />
            </div>
        );
    }
}

export default Index;



