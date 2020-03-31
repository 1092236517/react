import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';
import ResTable from './resTable';
import SearchForm from './searchForm';
import InfoModal from './infoModal';
import OperBtn from './operBtn';
import ResLable from './resLable';
@tabWrap({
    tabName: '周薪账单',
    stores: ['weeklyWageBillStore']
})
@inject('weeklyWageBillStore', 'globalStore')
@observer
class WeeklyWageBill extends Component {
    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/weeklyWageManager/bill']);
        if (!this.props.weeklyWageBillStore.view.isDirty) {
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
            exportRecord,
            cancelBatch,
            auditBill,
            startQuery,
            resetPageCurrent,
            handleFormValuesChange,
            setSelectRowKeys,
            setPagination,
            resetForm,
            showAuditModal,
            closeAuditModal,
            view: {
                tableInfo, pagination, searchValue, isShowAuditModal
            }
        } = this.props.weeklyWageBillStore;
        const { agentList, companyList, laborList } = this.props.globalStore;

        return (
            <div>
                <OperBtn {...{ showAuditModal, exportRecord, cancelBatch, selectedRowKeys: tableInfo.selectedRowKeys }} />
                <SearchForm {...{ searchValue, handleFormValuesChange, resetPageCurrent, startQuery, resetForm, agentList, companyList, laborList }} />
                <ResLable {...tableInfo} />
                <ResTable {...{ setSelectRowKeys, pagination, tableInfo, startQuery, setPagination, showAuditModal }} />

                {
                    isShowAuditModal &&
                    <InfoModal {...{ auditBill, closeAuditModal, batchID: (tableInfo.selectedRowKeys || []).toString() }} />
                }
            </div>
        );
    }
}

export default WeeklyWageBill;