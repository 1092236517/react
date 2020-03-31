import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';
import ResTable from './resTable';
import SearchForm from './searchForm';
import OperBtn from './operBtn';
import moment from 'moment';
@tabWrap({
    tabName: '到账/出账明细',
    stores: ['entryAndExitDetailStore']
})
@inject('entryAndExitDetailStore', 'globalStore')
@observer
export default class extends Component {
    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/bAccountManager/entryAndExitDetail']);
        if (!this.props.entryAndExitDetailStore.view.isDirty) {
            this.init();
        }
    }

    init() {
        const { hasAllCompanyInfo, getAllCompanyInfo, bankPayAccountList, getAllBankPayAcct } = this.props.globalStore;
        const { startQuery, handleFormValuesChange, view: {
            searchValue
        } } = this.props.entryAndExitDetailStore;
        if (!hasAllCompanyInfo) {
            getAllCompanyInfo();
        }

        if (bankPayAccountList.length == 0) {
            getAllBankPayAcct();
        }

        if (window.location.search) {
            let obj = JSON.parse('{"' + decodeURI(window.location.search.slice(1).replace(/&/g, "\",\"").replace(/=/g, "\":\"")) + '"}');
            handleFormValuesChange({
                ...searchValue,
                EntId: parseInt(obj.EntId, 10),
                TrgtSpId: parseInt(obj.TrgtSpId, 10),
                RelatedMoBegin: moment(obj.RelatedMo),
                RelatedMoEnd: moment(obj.RelatedMo),
                DireactType: obj.DireactType,
                SplitTyp: obj.DireactType === 'zreport' ? 1 : 3
            });

        }
        startQuery();
    }

    render() {
        const {
            view: {
                infoModal,
                tableInfo,
                pagination,
                searchValue
            },
            exportRecord,
            startQuery,
            resetForm,
            editAccount,
            resetPageCurrent,
            setPagination,
            saveData,
            handleFormValuesChange,
            handleFormReset,
            setFiledValue
        } = this.props.entryAndExitDetailStore;
        const { bankPayAccountList, companyList, laborList } = this.props.globalStore;

        return (
            <div>
                <OperBtn {...{ exportRecord, selectedRowKeys: tableInfo.selectedRowKeys }} />
                <SearchForm {...{
                    startQuery,
                    resetPageCurrent,
                    resetForm,
                    companyList,
                    laborList,
                    searchValue,
                    handleFormValuesChange,
                    handleFormReset,
                    setFiledValue
                }} />

                <ResTable {...{
                    editAccount,
                    setPagination,
                    tableInfo,
                    pagination
                }} />

            </div >
        );
    }
}