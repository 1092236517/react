import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';
import ResTable from './resTable';
import SearchForm from './searchForm';
import OperBtn from './operBtn';

@tabWrap({
    tabName: '劳务打款数据审核',
    stores: ['rtnFeeRemitAuditStore']
})

@inject('rtnFeeRemitAuditStore', 'globalStore')
@observer
class Index extends Component {
    componentDidMount() {
        if (!this.props.rtnFeeRemitAuditStore.view.isDirty) {
            this.init();
        }
    }

    init() {
        const { hasAllCompanyInfo, getAllCompanyInfo } = this.props.globalStore;
        if (!hasAllCompanyInfo) {
            getAllCompanyInfo();
        }

        const { startQuery } = this.props.rtnFeeRemitAuditStore;
        startQuery();
    }

    render() {
        const {
            rtnFeeRemitAuditStore: {
                view: { searchValue, tableInfo, pagination },
                startQuery,
                handleFormValuesChange,
                resetForm,
                setPagination, 
                setSelectRowKeys,
                exportRecord,
                resetPageCurrent
            },
            globalStore: {
                companyList, laborList
            }
        } = this.props;

        return (
            <div>
                <OperBtn
                    selectedRowKeys={tableInfo.selectedRowKeys}
                    reloadData={startQuery}
                    exportRecord={exportRecord} />

                <SearchForm {...{ searchValue, handleFormValuesChange, resetForm, companyList, laborList, startQuery, resetPageCurrent }} />

                <ResTable {...{ tableInfo, pagination, setPagination, setSelectRowKeys }} />
            </div>
        );
    }
}

export default Index;