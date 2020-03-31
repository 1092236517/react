import React, { Component } from 'react';
import { Button, message } from 'antd';
import { inject, observer } from "mobx-react";
import { tabWrap } from 'ADMIN_PAGES';
import ResTable from './resTable';
import ResLable from './resLable';
import SearchForm from './searchForm';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import HandleForm from './handleForm';

@tabWrap({
    tabName: '周薪查漏',
    stores: ['weeklyWageLeakStore']
})
@inject('weeklyWageLeakStore', 'globalStore')
@observer
class WeeklyWageList extends Component {
    state = {
        modalIsShow: false,
        selectedRowKeys: []
    }


    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/weeklyWageManager/leak']);
        if (!this.props.weeklyWageLeakStore.view.isDirty) {
            this.init();
        }
    }

    init() {
        const { hasAllCompanyInfo, getAllCompanyInfo } = this.props.globalStore;
        if (!hasAllCompanyInfo) {
            getAllCompanyInfo();
        }
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

    handleData = () => {
        const { selectedRowKeys } = this.props.weeklyWageLeakStore.view.tableInfo;
        if (selectedRowKeys.length == 0) {
            message.info('请选择要操作的记录！');
            return;
        }
        window._czc.push(['_trackEvent', '周薪查漏', '批量处理', '周薪查漏_Y结算']);
        this.showModal(selectedRowKeys);
    }

    render() {
        const { view: { TotalAmtCount, TotalClockCount, tableInfo: { dataList, total, loading, selectedRowKeys }, pagination: { current, pageSize }
        }, startQuery, setPagination,
            setSelectRowKeys, exportRecord } = this.props.weeklyWageLeakStore;

        const { exportX } = resId.weeklyWageManager.list;
        const { operDataX } = resId.weeklyWageManager.leak;

        return (
            <div>
                <div className='mb-16'>
                    {authority(exportX)(<Button type='primary' onClick={() => { exportRecord(); window._czc.push(['_trackEvent', '周薪查漏', '导出', '周薪查漏_Y结算']); }}>导出</Button>)}
                    {authority(operDataX)(<Button type='primary' className="ml-8" onClick={this.handleData}>批量处理</Button>)}
                </div>

                <SearchForm {...this.props} />
                <ResLable {...{ TotalAmtCount, TotalClockCount }} />
                <ResTable {... {
                    dataList,
                    total,
                    loading,
                    selectedRowKeys,
                    current,
                    pageSize,
                    startQuery,
                    setPagination,
                    setSelectRowKeys,
                    showModal: this.showModal
                }} />
                {
                    this.state.modalIsShow &&
                    <HandleForm {...{ selectedRowKeys: this.state.selectedRowKeys, hideModal: this.hideModal, reloadData: startQuery }} />
                }
            </div>
        );
    }
}

export default WeeklyWageList;