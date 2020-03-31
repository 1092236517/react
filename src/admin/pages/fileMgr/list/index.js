import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';
import { Modal } from 'antd';
import ResTable from './resTable';
import SearchForm from './searchForm';
import OperBtn from './operBtn';
import FileInfo from '../add/fileInfo';
import moment from 'moment';

const fixFile = (fileList) => fileList.map(({ FileName, OriginFileName, Bucket }) => ({
    uid: FileName,
    name: OriginFileName,
    status: 'done', response: { status: 'success', name: `/${FileName}`, bucket: Bucket }
}));

@tabWrap({
    tabName: '文件查询',
    stores: ['fileListStore']
})
@inject('fileListStore', 'globalStore')
@observer
class Index extends Component {
    state = {
        isShowInfo: false,
        fileInfo: null
    }

    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/fileMgr/list']);
        const { fileListStore } = this.props;
        if (!fileListStore.view.isDirty) {
            this.init();
        }
    }

    init() {
        const { hasAllCompanyInfo, getAllCompanyInfo } = this.props.globalStore;
        const { startQuery } = this.props.fileListStore;
        if (!hasAllCompanyInfo) {
            getAllCompanyInfo();
        }
        startQuery();
    }

    showInfo = (fileInfo) => {
        const { BeginDate, EndDate, FileList1, FileList2, Month } = fileInfo;
        window._czc.push(['_trackEvent', '文件查询', '编辑操作', '文件查询_Y结算']);
        this.setState({
            isShowInfo: true,
            fileInfo: {
                ...fileInfo,
                BeginDate: moment(BeginDate),
                EndDate: moment(EndDate),
                Month: moment(Month),
                FileList1: fixFile(FileList1),
                FileList2: fixFile(FileList2)
            }
        });
    }

    hideInfo = () => {
        this.setState({
            isShowInfo: false
        });
    }

    setStoreFile = (id, list) => {
        const { fileInfo } = this.state;
        this.setState({
            fileInfo: {
                ...fileInfo,
                [id]: [...list]
            }
        });
    }

    handleFileInfoChange = (allValues) => {
        this.setState({
            fileInfo: allValues
        });
    }

    refreshData = () => {
        const { startQuery } = this.props.fileListStore;
        this.hideInfo();
        startQuery();
    }

    render() {
        const {
            handleFormValuesChange,
            view: { searchValue, tableInfo, pagination },
            startQuery,
            resetPageCurrent,
            setPagination,
            handleFormReset,
            setSelectRowKeys
        } = this.props.fileListStore;
        const { agentList, companyList, laborList } = this.props.globalStore;
        const { isShowInfo, fileInfo } = this.state;

        return (
            <div>
                <OperBtn
                    selectedRowKeys={tableInfo.selectedRowKeys}
                    reloadData={startQuery} />

                <SearchForm {...{ tableInfo, agentList, companyList, laborList, searchValue, handleFormValuesChange, startQuery, resetPageCurrent, handleFormReset }} />

                <ResTable {...{ tableInfo, pagination, setPagination, showInfo: this.showInfo, setSelectRowKeys }} />

                {
                    isShowInfo &&
                    <Modal
                        visible={true}
                        title='修改文件信息'
                        footer={null}
                        onCancel={this.hideInfo} >
                        <FileInfo
                            {...{ companyList, laborList, setStoreFile: this.setStoreFile, formValue: fileInfo, editMode: true, refreshData: this.refreshData, handleFormValuesChange: this.handleFileInfoChange }}
                        />
                    </Modal>

                }
            </div>
        );
    }
}

export default Index;