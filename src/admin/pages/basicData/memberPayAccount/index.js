import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';
import ResTable from './resTable';
import SearchForm from './searchForm';
import InfoModal from './infoModal';
import OperBtn from './operBtn';

@tabWrap({
    tabName: '会员打款虚拟子账户',
    stores: ['memberPayAccountStore']
})
@inject('memberPayAccountStore', 'globalStore')
@observer
export default class extends Component {
    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/basicData/memberPayAccount']);
        if (!this.props.memberPayAccountStore.view.isDirty) {
            this.init();
        }
    }

    init() {
        const { hasAllCompanyInfo, getAllCompanyInfo, bankPayAccountList, getAllBankPayAcct } = this.props.globalStore;
        if (!hasAllCompanyInfo) {
            getAllCompanyInfo();
        }

        if (bankPayAccountList.length == 0) {
            getAllBankPayAcct();
        }

        this.props.memberPayAccountStore.startQuery();
    }

    render() {
        const {
            view: {
                infoModal,
                tableInfo,
                pagination,
                searchValue
            },
            setInfoModalShow,
            exportRec,
            startQuery,
            resetForm,
            editAccount,
            resetPageCurrent,
            setPagination,
            saveData,
            handleFormValuesChange
        } = this.props.memberPayAccountStore;
        const { bankPayAccountList, companyList, laborList } = this.props.globalStore;

        return (
            <div>
                <OperBtn {...{ exportRec, setInfoModalShow }} />

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
                    editAccount,
                    setPagination,
                    tableInfo,
                    pagination
                }} />

                {
                    infoModal.show &&
                    <InfoModal {...{
                        infoModal,
                        setInfoModalShow,
                        saveData,
                        bankPayAccountList,
                        companyList,
                        laborList
                    }} />
                }
            </div >
        );
    }
}