import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';
import InfoModal from './infoModal';
import SearchFrom from './searchForm';
import ResTable from './resTable';

@tabWrap({
    tabName: '补发月薪',
    stores: ['monthlyWageReissueStore']
})
@inject('monthlyWageReissueStore', 'globalStore')
@observer
class MonthlyWageReissue extends Component {
    state = {
        infoModalIsShow: false,
        recordInfo: null
    };

    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/monthlyWageManager/reissue']);
        if (!this.props.monthlyWageReissueStore.view.isDirty) {
            this.init();
        }
    }

    init() {
        const { hasAllCompanyInfo, getAllCompanyInfo } = this.props.globalStore;
        if (!hasAllCompanyInfo) {
            getAllCompanyInfo();
        }
    }

    startAdd = (e, record) => {
        const { setFromJump } = this.props.monthlyWageReissueStore;;
        this.setState({
            infoModalIsShow: true,
            recordInfo: record ? record : null
        });
        setFromJump(!e);
    }

    hideModal = () => {
        this.setState({
            infoModalIsShow: false,
            recordInfo: null
        });
    }

    startEdit = (recordInfo) => {
        this.setState({
            infoModalIsShow: true,
            recordInfo
        });
    }

    render() {
        const {
            view: {
                searchValue,
                tableVisible,
                tableInfo,
                fromJump,
                operType
            },
            showNewTable,
            commitData,
            editRecord,
            resetOldTable,
            delRecord,
            setImportFile,
            impPreview,
            expPreview,
            handleFormValuesChange,
            searchByIdInput,
            updataForSixType,
            switchOperTypeStore
        } = this.props.monthlyWageReissueStore;
        const { companyList, laborList, getLaborText, getCompanyText } = this.props.globalStore;

        return (
            <div>
                <SearchFrom {...{
                    searchValue,
                    tableVisible,
                    showNewTable,
                    companyList,
                    laborList,
                    commitData,
                    resetOldTable,
                    setImportFile,
                    impPreview,
                    expPreview,
                    startAdd: this.startAdd,
                    getLaborText,
                    getCompanyText,
                    handleFormValuesChange,
                    switchOperTypeStore
                }} />
                <ResTable {...{
                    getLaborText,
                    getCompanyText,
                    tableVisible,
                    tableInfo,
                    delRecord,
                    startEdit: this.startEdit,
                    startAdd: this.startAdd,
                    SalaryType: searchValue.SalaryType
                }} />

                {
                    <InfoModal
                        {...searchValue}
                        recordInfo={this.state.recordInfo}
                        editRecord={editRecord}
                        fromJump={fromJump}
                        hideModal={this.hideModal}
                        searchByIdInput={searchByIdInput}
                        updataForSixType={updataForSixType}
                        operType={operType}
                        modalShow={this.state.infoModalIsShow}
                    />
                }
            </div>
        );
    }
}

export default MonthlyWageReissue;