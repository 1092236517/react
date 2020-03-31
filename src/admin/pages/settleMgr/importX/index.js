import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';
import ResTable from './resTable';
import SearchForm from './searchForm';
import DownTips from './downTips';

@tabWrap({
    tabName: '导入X',
    stores: ['importXStore']
})

@inject('importXStore', 'globalStore')
@observer
class Index extends Component {
    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/settleMgr/importX']);
        if (!this.props.importXStore.view.isDirty) {
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
            importXStore: {
                view: { searchValue, tableInfo, canUseXType },
                handleFormValuesChange,
                resetForm,
                importPreview,
                exportImpXPre,
                setImportFile,
                generateBatchImpX
            },
            globalStore: {
                companyList, laborList
            }
        } = this.props;

        return (
            <div>
                <DownTips />

                <SearchForm {...{ searchValue, handleFormValuesChange, resetForm, importPreview, companyList, laborList, canUseXType, exportImpXPre, setImportFile, generateBatchImpX }} />

                <ResTable {...{ tableInfo }} />
            </div>
        );
    }
}

export default Index;