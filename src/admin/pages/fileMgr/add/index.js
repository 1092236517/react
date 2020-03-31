import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';
import FileInfo from './fileInfo';

@tabWrap({
    tabName: '文件添加',
    stores: ['fileAddStore']
})
@inject('fileAddStore', 'globalStore')
@observer
class Index extends Component {
    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/fileMgr/add']);
        const { fileAddStore } = this.props;
        if (!fileAddStore.view.isDirty) {
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
        } = this.props.fileAddStore;
        const { view: { formValue }, setStoreFile, handleFormValuesChange, resetForm } = this.props.fileAddStore;
        const { companyList, laborList } = this.props.globalStore;

        return (
            <div>
                <FileInfo {...{ companyList, laborList, setStoreFile, formValue, handleFormValuesChange, editMode: false, resetForm }} />
            </div>
        );
    }
}

export default Index;