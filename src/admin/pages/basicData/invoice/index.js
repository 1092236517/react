import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';
import ResTable from './resTable';
import SearchForm from './searchForm';
import Detail from './detail';
import OperBtn from './operBtn';
import History from './history';

@tabWrap({
    tabName: '开票信息',
    stores: ['invoiceStore']
})
@inject('invoiceStore', 'globalStore')
@observer
export default class extends Component {
    state = {
        detailModal: {
            show: false,
            record: null
        },
        historyModal: {
            show: false,
            param: null
        }
    }

    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/basicData/invoice']);
        if (!this.props.invoiceStore.view.isDirty) {
            this.init();
        }
    }

    hideDetail = () => {
        this.setState({
            detailModal: {
                show: false,
                record: null
            }
        });
    }

    showDetail = (record) => {
        this.setState({
            detailModal: {
                show: true,
                record: (record && record.DataId) ? record : null
            }
        });
        window._czc.push(['_trackEvent', '开票信息', '编辑', '开票信息_Y结算']);
    }

    showHistory = ({ EntId, TrgtSpId, TrgtSpShortName, EntShortName }) => {
        this.setState({
            historyModal: {
                show: true,
                param: {
                    EntId, TrgtSpId, TrgtSpShortName, EntShortName
                }
            }
        });
        window._czc.push(['_trackEvent', '开票信息', '查看历史版本', '开票信息_Y结算']);
    }

    closeHistory = () => {
        this.setState({
            historyModal: {
                show: false,
                param: null
            }
        });
    }

    init() {
        const { hasAllCompanyInfo, getAllCompanyInfo, bankPayAccountList, getAllBankPayAcct } = this.props.globalStore;
        if (!hasAllCompanyInfo) {
            getAllCompanyInfo();
        }

        if (bankPayAccountList.length == 0) {
            getAllBankPayAcct();
        }

        this.props.invoiceStore.startQuery();
    }

    render() {
        const {
            view: {
                tableInfo,
                pagination,
                searchValue
            },
            setSelectRowKeys,
            startQuery,
            resetForm,
            resetPageCurrent,
            setPagination,
            handleFormValuesChange, exportRecord
        } = this.props.invoiceStore;
        const { bankPayAccountList, companyList, laborList } = this.props.globalStore;
        const { detailModal, historyModal } = this.state;

        return (
            <div>
                <OperBtn {...{ showDetail: this.showDetail, selectedRowKeys: tableInfo.selectedRowKeys, startQuery, exportRecord }} />

                <SearchForm {...{
                    startQuery,
                    resetPageCurrent,
                    resetForm,
                    companyList,
                    laborList,
                    searchValue,
                    handleFormValuesChange
                }} />

                <ResTable {...{
                    editInvoice: this.showDetail,
                    historyInvoice: this.showHistory,
                    setPagination,
                    tableInfo,
                    pagination,
                    setSelectRowKeys
                }} />

                {
                    detailModal.show &&
                    <Detail {...{
                        detailModal,
                        hideDetail: this.hideDetail,
                        bankPayAccountList,
                        companyList,
                        laborList,
                        startQuery
                    }} />
                }

                {
                    historyModal.show &&
                    <History {...historyModal.param} closeHistory={this.closeHistory} />
                }
            </div >
        );
    }
}