import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';
import ResTable from './resTable';
import SearchForm from './searchForm';
import OperBtn from './operBtn';
import ConfigInfo from './configInfo';

@tabWrap({
    tabName: '中介费配置',
    stores: ['configAgentAStore']
})

@inject('configAgentAStore', 'globalStore')
@observer
class Index extends Component {
    state = {
        infoIsShow: false,
        configInfo: null
    }

    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/settleMgr/configAgentA']);
        if (!this.props.configAgentAStore.view.isDirty) {
            this.init();
        }
    }

    init() {
        const { hasAllCompanyInfo, getAllCompanyInfo } = this.props.globalStore;
        const { startQuery } = this.props.configAgentAStore;
        if (!hasAllCompanyInfo) {
            getAllCompanyInfo();
        }
        startQuery();
    }

    hideModal = () => {
        this.setState({
            infoIsShow: false
        });
    }

    showModal = (data = null) => {
        this.setState({
            infoIsShow: true,
            configInfo: data
        });
    }

    render() {
        const {
            configAgentAStore: {
                view: { searchValue, tableInfo, pagination },
                handleFormValuesChange,
                resetForm,
                startQuery,
                setPagination,
                resetPageCurrent,
                setSelectRowKeys
            },
            globalStore: {
                companyList, laborList
            }
        } = this.props;

        const { infoIsShow, configInfo } = this.state;

        return (
            <div>
                <OperBtn
                    showModal={this.showModal}
                    hideModal={this.hideModal}
                    selectedRows={tableInfo.selectedRows}
                    reloadData={startQuery} />

                <SearchForm {...{ searchValue, handleFormValuesChange, resetForm, startQuery, resetPageCurrent, companyList, laborList }} />

                <ResTable {...{ tableInfo, pagination, setPagination, setSelectRowKeys, showModal: this.showModal }} />

                {
                    infoIsShow &&
                    <ConfigInfo
                        record={configInfo}
                        hideModal={this.hideModal}
                        reloadData={startQuery}
                        {...{ companyList, laborList }} />
                }
            </div>
        );
    }
}

export default Index;