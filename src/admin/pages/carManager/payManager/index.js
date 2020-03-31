import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';
import ResTable from './resTable';
import SearchForm from './searchForm';
import InfoModal from './infoModal';
import OperBtn from './operBtn';

@tabWrap({
    tabName: '支付管理',
    stores: ['payManagerStore']
})
@inject('payManagerStore', 'globalStore')
@observer
export default class extends Component {
    componentDidMount() {
        if (!this.props.payManagerStore.view.isDirty) {
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

        this.props.payManagerStore.startQuery();
    }

    render() {
        const {
            view: {
                tableInfo,
                pagination,
                searchValue
            },
            setInfoModalShow,
            exportRec,
            startQuery,
            resetForm,
            resetPageCurrent,
            setPagination,
            handleFormValuesChange
        } = this.props.payManagerStore;

        return (
            <div>
                <OperBtn {...{ exportRec, setInfoModalShow }} />

                <SearchForm {...{
                    startQuery,
                    resetPageCurrent,
                    resetForm,

                    searchValue,
                    handleFormValuesChange
                }} />

                <ResTable {...{
                    setPagination,
                    tableInfo,
                    pagination
                }} />
            </div >
        );
    }
}