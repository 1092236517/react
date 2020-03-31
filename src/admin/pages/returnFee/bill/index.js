import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';
import ResTable from './resTable';
import SearchForm from './searchForm';
import OperBtn from './operBtn';
import ResLable from './resLable';
@tabWrap({
    tabName: '返费账单',
    stores: ['rtnFeeBillStore']
})
@inject('rtnFeeBillStore', 'globalStore')
@observer

class Index extends Component {
    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/returnFee/bill']);
        if (!this.props.rtnFeeBillStore.view.isDirty) {
            this.init();
        }
    }

    init() {
        const { hasAllCompanyInfo, getAllCompanyInfo } = this.props.globalStore;
        const { startQuery } = this.props.rtnFeeBillStore;
        if (!hasAllCompanyInfo) {
            getAllCompanyInfo();
        }
        startQuery();
    }

    render() {
        const {
            rtnFeeBillStore: {
                view: { searchValue, tableInfo, pagination },
                startQuery,
                handleFormValuesChange,
                resetForm,
                setPagination,
                setSelectRowKeys,
                exportRecord,
                resetPageCurrent,
                auditBillOpt,
                saveMarkRecord
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
                    exportRecord={exportRecord}
                    auditBillOpt={auditBillOpt}
                    saveMarkRecord={saveMarkRecord}
                />

                <SearchForm {...{ searchValue, handleFormValuesChange, resetForm, companyList, laborList, startQuery, resetPageCurrent }} />
                {/* <ResLable {...lableInfo} total={tableInfo.total} /> */}
                <ResLable {...{ tableInfo }} />
                <ResTable {...{ tableInfo, pagination, setPagination, setSelectRowKeys }} />
            </div>
        );
    }
}

export default Index;


