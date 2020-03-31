import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';
import ResTable from './resTable';
import SearchForm from './searchForm';
import OperBtn from './operBtn';
import HandleForm from './handleForm';

@tabWrap({
    tabName: '月薪查漏',
    stores: ['monthlyWageLeakStore']
})
@inject('monthlyWageLeakStore', 'globalStore')
@observer
class WeeklyWageList extends Component {
    state = {
        modalIsShow: false,
        selectedRowKeys: []
    }

    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/monthlyWageManager/leak']);
        if (!this.props.monthlyWageLeakStore.view.isDirty) {
            this.init();
        }
    }

    init() {
        const { hasAllCompanyInfo, getAllCompanyInfo } = this.props.globalStore;
        const { startQuery } = this.props.monthlyWageLeakStore;

        if (!hasAllCompanyInfo) {
            getAllCompanyInfo();
        }
        // startQuery();
    }

    showModal = (keys) => {
        this.setState({
            modalIsShow: true,
            selectedRowKeys: keys
        });
    }

    hideModal = () => {
        this.setState({
            modalIsShow: false,
            selectedRowKeys: []
        });
    }


    render() {
        const {
            monthlyWageLeakStore: {
                view: { searchValue, tableInfo, pagination },
                handleFormValuesChange,
                resetForm,
                startQuery,
                setPagination,
                resetPageCurrent,
                setSelectRowKeys,
                handleData,
                exportData
            },
            globalStore: {
                companyList, laborList, agentList
            }
        } = this.props;

        const { selectedRowKeys, modalIsShow } = this.state;


        return (
            <div>
                <OperBtn {...{ handleData, exportData, selectedRowKeys: tableInfo.selectedRowKeys, showModal: this.showModal }} />

                <SearchForm {...{ searchValue, handleFormValuesChange, resetForm, startQuery, resetPageCurrent, companyList, laborList, agentList }} />

                <ResTable {...{ tableInfo, pagination, startQuery, setPagination, resetPageCurrent, setSelectRowKeys, showModal: this.showModal }} />

                {
                    modalIsShow &&
                    <HandleForm {...{ selectedRowKeys, hideModal: this.hideModal, reloadData: startQuery }} />
                }
            </div>
        );
    }
}

export default WeeklyWageList;