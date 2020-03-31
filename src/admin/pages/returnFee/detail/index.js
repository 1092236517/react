import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';
import ResTable from './resTable';
import SearchForm from './searchForm';
import OperBtn from './operBtn';


@tabWrap({
    tabName: '返费明细',
    stores: ['rtnFeeDetailStore']
})
@inject('rtnFeeDetailStore', 'globalStore')
@observer
class Index extends Component {
    componentDidMount() {
        if (!this.props.rtnFeeDetailStore.view.isDirty) {
            this.init();
        }
    }

    init() {
        const { hasAllCompanyInfo, getAllCompanyInfo } = this.props.globalStore;
        const { startQuery } = this.props.rtnFeeDetailStore;
        if (!hasAllCompanyInfo) {
            getAllCompanyInfo();
        }
        startQuery();
    }

    render() {
        const {
            rtnFeeDetailStore: {
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


