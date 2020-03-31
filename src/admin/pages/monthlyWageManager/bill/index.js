import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';
import ResTable from './resTable';
import SearchForm from './searchForm';
import OperBtn from './operBtn';
import InfoModal from './infoModal';
import ResLable from './resLable';
@tabWrap({
    tabName: '月薪账单',
    stores: ['monthlyWageBillStore']
})

@inject('monthlyWageBillStore', 'globalStore')
@observer
class Index extends Component {
    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/monthlyWageManager/bill']);
        if (!this.props.monthlyWageBillStore.view.isDirty) {
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
            view: {
                tableInfo,
                pagination,
                searchValue,
                isShowAuditModal
            },
            startQuery,
            setPagination,
            exportRecord,
            handleFormValuesChange,
            resetPageCurrent,
            resetForm,
            showAuditModal,
            cancelBatch,
            auditBill,
            closeAuditModal,
            setSelectRowKeys
        } = this.props.monthlyWageBillStore;
        const { companyList, laborList } = this.props.globalStore;

        return (
            <div>
                <OperBtn {...{ showAuditModal, exportRecord, cancelBatch, selectedRowKeys: tableInfo.selectedRowKeys }} />

                <SearchForm {...{ searchValue, handleFormValuesChange, startQuery, resetPageCurrent, companyList, laborList, resetForm }} />
                <ResLable {...tableInfo} />
                <ResTable {...{ tableInfo, pagination, startQuery, setPagination, setSelectRowKeys, showAuditModal }} />

                {
                    isShowAuditModal &&
                    <InfoModal {...{ auditBill, closeAuditModal, batchID: (tableInfo.selectedRowKeys || []).toString() }} />
                }

            </div>
        );
    }
}

export default Index;