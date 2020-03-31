import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';
import ResTable from './resTable';
import SearchForm from './searchForm';
import OperBtn from './operBtn';
import ResLable from './resLable';

@tabWrap({
    tabName: '导入X查询/审核',
    stores: ['importXListStore']
})

@inject('importXListStore', 'globalStore')
@observer
class Index extends Component {
    componentDidMount() {
        const { importXListStore } = this.props;
        window._czc.push(['_trackPageview', '/admin/settleMgr/importXList']);
        let extraParams = sessionStorage.getItem('TEMP_JUMP_PARAMS');
        if (extraParams) {
            console.log(JSON.parse(extraParams));
            importXListStore.resetForm();
            sessionStorage.removeItem('TEMP_JUMP_PARAMS');
            importXListStore.startQuery(JSON.parse(extraParams));
            return;
        }

        if (!importXListStore.view.isDirty) {
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
            importXListStore: {
                view: { searchValue, tableInfo, pagination, attachInfo },
                handleFormValuesChange,
                resetForm,
                startQuery,
                setPagination,
                resetPageCurrent,
                exportTB,
                setSelectRowKeys
            },
            globalStore: {
                companyList, laborList
            }
        } = this.props;

        return (
            <div>
                <OperBtn
                    selectedRows={tableInfo.selectedRows}
                    selectedRowKeys={tableInfo.selectedRowKeys}
                    reloadData={startQuery}
                    {...{ exportTB }} />

                <SearchForm {...{ searchValue, handleFormValuesChange, resetForm, startQuery, setPagination, resetPageCurrent, companyList, laborList }} />

                <ResLable {...attachInfo} />

                <ResTable {...{ tableInfo, pagination, setPagination, setSelectRowKeys }} />
            </div>
        );
    }
}

export default Index;