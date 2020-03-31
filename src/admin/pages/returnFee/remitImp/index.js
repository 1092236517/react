import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';
import ResTable from './resTable';
import SearchForm from './searchForm';
import DownTips from './downTips';

@tabWrap({
    tabName: '劳务打款数据导入',
    stores: ['rtnFeeRemitImpStore']
})

@inject('rtnFeeRemitImpStore', 'globalStore')
@observer
class Index extends Component {
    componentDidMount() {
        if (!this.props.rtnFeeRemitImpStore.view.isDirty) {
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
            rtnFeeRemitImpStore: {
                view: { searchValue, tableInfo, pagination },
                handleFormValuesChange,
                resetForm,
                importPreview,
                setImportFile,
                setPagination, 
                setSelectRowKeys,
                expPreview,
                geneRemitSave,
                resetTable,
                enableImp
            },
            globalStore: {
                companyList, laborList
            }
        } = this.props;

        return (
            <div>
                <DownTips />

                <SearchForm {...{ searchValue, handleFormValuesChange, resetForm, importPreview, companyList, laborList, setImportFile, expPreview, geneRemitSave, resetTable, enableImp }} />

                <ResTable {...{ tableInfo, pagination, setPagination, setSelectRowKeys }} />
            </div>
        );
    }
}

export default Index;