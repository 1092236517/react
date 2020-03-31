import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import { tabWrap } from 'ADMIN_PAGES';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';
import { tableDateRender, tableDateTimeRender } from 'ADMIN_UTILS/tableItemRender';
import { Button, Table, Modal } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { convertCentToThousandth } from 'web-react-base-utils';
import SearchForm from './searchForm';

@tabWrap({
    tabName: '到账/出账',
    stores: ['entryAndExitStore']
})

@inject('entryAndExitStore', 'globalStore')

@observer
export default class extends React.Component {
    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/bAccountManager/entryAndExit']);
        const { searchByInput } = this.props.entryAndExitStore;
        if (!this.props.entryAndExitStore.view.isDirty) {
            if (window.location.search) {
                this.props.entryAndExitStore.searchByRedirectValue(window.location.search.split('=')[1].split(',').map((item, index) => {
                    return parseInt(item, 10);
                }));
            } else {
                searchByInput();
            }
            this.getLaborList();
        }
    }

    getList = this.props.entryAndExitStore.getList;
    getLaborList = this.props.globalStore.getLaborList;

    // 导出
    exportList = () => {
        window._czc.push(['_trackEvent', '到账/出账', '导出', '到账/出账_Y结算']);
        let Data = this.props.entryAndExitStore.exportList();
        Data.then((res) => {
            window.open(res.FileUrl);
        });
    }

    submitrequestRedRush = (RecordID) => {
        const { requestRedRush } = this.props.entryAndExitStore;
        Modal.confirm({
            content: <h3>确认红冲？</h3>,
            onOk: () => {
                requestRedRush(RecordID);
                window._czc.push(['_trackEvent', '到账/出账', '红冲', '到账/出账_Y结算']);
            }
        });
    }
    render() {
        const { view, handleFormValuesChange, handleFormReset, getList, searchByInput, resetPageCurrent, setPagination, requestRedRush } = this.props.entryAndExitStore;
        const { searchValue, RecordList, FormListStatus, pagination, totalNum } = view;
        const { laborList } = this.props.globalStore;

        let columns = [
            { title: '记录ID', dataIndex: 'RecordID', align: 'center', width: 150 },
            { title: '录入时间', dataIndex: 'CreateTime', align: 'center', width: 150 },
            { title: '录入人', dataIndex: 'ApplyUserName', align: 'center', width: 100 },
            { title: '劳务简称', dataIndex: 'SPShortName', align: 'center', width: 220 },
            {
                title: '金额（元）',
                dataIndex: 'Amount',
                align: 'center',
                width: 100,
                render: (text, record) => record.OPType === 1 ?
                    <span>+{convertCentToThousandth(text)}</span> : <span>-{convertCentToThousandth(text)}</span>
            },
            {
                title: '出入金类型',
                dataIndex: 'OPType',
                align: 'center',
                width: 100,
                render: (text) => text === 1 ? <span>充值</span> : <span>提现</span>
            },
            {
                title: '银行打款时间',
                dataIndex: 'BankTransferTm',
                align: 'center',
                width: 100,
                render: tableDateRender
            },
            {
                title: '备注',
                dataIndex: 'Remark',
                align: 'center',
                width: 150
            },
            {
                title: '拆分状态',
                dataIndex: 'SplitSts',
                align: 'center',
                width: 80,
                render: (text) => text === 1 ? <span style={{ color: "#FF8C00" }}>未拆分</span> : <span>已拆分</span>
            },
            {
                title: '是否虚拟到出账',
                dataIndex: 'IsVirtual',
                align: 'center',
                width: 80,
                render: (text) => text === 1 ? <span >是</span> : <span>否</span>
            },
            { title: '拆分时间', dataIndex: 'SplitTm', align: 'center', width: 150, render: tableDateTimeRender },
            { title: '拆分人', dataIndex: 'SplitName', align: 'center', width: 100 },

            {
                title: '审核状态',
                dataIndex: 'AuditStatus',
                align: 'center',
                width: 80,
                render: (text) => text === 1 ? <span style={{ color: "#FF8C00" }}>待审核</span> : text === 2 ? <span>通过</span> : <span>拒绝</span>
            },
            { title: '审核时间', dataIndex: 'AuditTime', align: 'center', width: 150 },
            { title: '审核人', dataIndex: 'AuditUserName', align: 'center', width: 100 },

            { title: '审核备注', dataIndex: 'AuditRemark', align: 'center', width: 200 },
            {
                title: '红冲', dataIndex: '',
                align: 'center',
                width: 80,
                render: (text, record) => record.AuditStatus === 2 && record.RedRushState === 1 ? authority(resId.entryAndExitList.requestRedRush)(<a href='#' onClick={() => this.submitrequestRedRush(record.RecordID)}>红冲</a>) : null
            },
            { title: '红冲ID', dataIndex: 'BeRedRushID', align: 'center', width: 80, render: (text, record) => text !== 0 ? text : null },
            {
                title: '拆分', dataIndex: 'RecordID3',
                align: 'center',
                fixed: 'right',
                width: 80,
                render: (text, record) => record.AuditStatus === 1 && record.SplitSts === 1 ? authority(resId.entryAndExitList.split)(<Link onClick={() => { window._czc.push(['_trackEvent', '到账/出账', '拆分', '到账/出账_Y结算']); }} to={"/bAccountManager/entryAndExit/allIn?id=" + record.RecordID + "&diff=split"}>拆分</Link>) : null
            },
            {
                title: '审核', dataIndex: 'Audit',
                align: 'center',
                fixed: 'right',
                width: 80,
                render: (text, record) => record.AuditStatus === 1 && record.SplitSts === 2 ? authority(resId.entryAndExitList.examined)(<Link onClick={() => { window._czc.push(['_trackEvent', '到账/出账', '审核', '到账/出账_Y结算']); }} to={"/bAccountManager/entryAndExit/allIn?id=" + record.RecordID + "&SplitTm=" + record.SplitTm + "&diff=examined"}>审核</Link>) : null
            },
            {
                title: '查看', dataIndex: 'RecordID2',
                align: 'center',
                fixed: 'right',
                width: 80,
                render: (text, record) => authority(resId.entryAndExitList.check)(<Link onClick={() => { window._czc.push(['_trackEvent', '到账/出账', '查看', '到账/出账_Y结算']); }} to={`/bAccountManager/entryAndExit/allIn?id=${record.RecordID}&diff=check`}>查看</Link>)
            }

        ];
        return (
            <div>
                {authority(resId.entryAndExitList.apply)(<Button className="mb-20" type="primary"><Link onClick={() => { window._czc.push(['_trackEvent', '到账/出账', '录入', '到账/出账_Y结算']); }} to="/bAccountManager/entryAndExit/allIn?diff=apply">录入</Link></Button>)}
                <Button className="mb-20 ml-8" type="primary" onClick={this.exportList}>导出</Button>
                <SearchForm
                    {...{
                        searchValue,
                        laborList,
                        handleFormReset,
                        onValuesChange: handleFormValuesChange,
                        handleFormSubmit: getList,
                        searchByInput: searchByInput,
                        resetPageCurrent
                    }}
                />
                <Table
                    rowKey={'RecordID'}
                    bordered={true}
                    dataSource={RecordList.slice()}
                    loading={FormListStatus === "pending"}
                    columns={columns}
                    scroll={{ x: 2170, y: 550 }}
                    pagination={{
                        ...tablePageDefaultOpt,
                        pageSize: pagination.pageSize,
                        current: pagination.current,
                        total: totalNum,
                        onChange: (page, pageSize) => {
                            setPagination(page, pageSize);
                        },
                        onShowSizeChange: (current, size) => {
                            setPagination(current, size);
                        }
                    }}
                />
            </div>

        );
    }
}
