import { tabWrap } from 'ADMIN_PAGES';
import { Table, Modal, Button } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { convertCentToThousandth } from 'web-react-base-utils';
import { tableDateTimeRender, tableSrcRender } from 'ADMIN_UTILS/tableItemRender';
import SearchForm from './searchForm';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';

const confirm = Modal.confirm;

@tabWrap({
    tabName: '重发授权',
    stores: ['reAuthorizationStore']
})

@inject('reAuthorizationStore')

@observer
export default class extends React.Component {
    componentDidMount() {
        window._czc.push(['_trackPageview', '/admin/payOffManager/ReAuthorization']);
        if (!this.props.reAuthorizationStore.view.isDirty) {
            this.queryReAudit();
        }
    }

    queryReAudit = this.props.reAuthorizationStore.queryReAudit;

    // 确认授权
    reAudit = (text) => {
        let prop = this.props.reAuthorizationStore;
        confirm({
            title: '重新授权',
            content: '您确定要授权这条申请吗？',
            onOk() {
                prop.reAudit(text);
                window._czc.push(['_trackEvent', '重发授权', '重新授权', '重发授权_Y结算']);
            },
            onCancel() {}
        });
    }

    render() {
        const {view, handleFormValuesChange, handleFormReset, queryReAudit, resetPageCurrent, setPagination, onSelectChange, line} = this.props.reAuthorizationStore;
        const {searchValue, RecordList, FormListStatus, pagination, totalNum, selectedRowKeys} = view;
        
        let columns = [
            {title: '关联批次号', dataIndex: 'BillBatchId', align: 'center', width: 100},
            {title: '姓名', dataIndex: 'BankAccntName', align: 'center', width: 100},
            {title: '身份证号码', dataIndex: 'IdCardNum', align: 'center', width: 150},
            {title: '银行名称', dataIndex: 'BankName', align: 'center', width: 150},
            {title: '银行卡号', dataIndex: 'BankCardNum', align: 'center', width: 180},
            {
                title: '打款金额', 
                dataIndex: 'DealAmt', 
                align: 'center', 
                width: 100,
                render: convertCentToThousandth
            },
            {title: '款项说明', dataIndex: 'TransferRemark', align: 'center', width: 200},
            {
                title: '打款类型', 
                dataIndex: 'RemittanceTyp',
                align: 'center',
                width: 80,
                render: (text) => { return ({1: "周薪", 2: "月薪", 3: "中介费", 4: '返费', 5: '周返费'}[text]);} 
            },
            {
                title: '来源', 
                dataIndex: 'BillSrce',
                align: 'center',
                width: 80,
                render: tableSrcRender
            },
            {title: '申请人', dataIndex: 'UpdatedByName', align: 'center', width: 100},
            {title: '申请时间', dataIndex: 'UpdatedTm', align: 'center', width: 150, render: tableDateTimeRender},
            {title: '授权时间', dataIndex: 'AuditTm', align: 'center', width: 150, render: tableDateTimeRender},   
            {title: '授权人', dataIndex: 'AuditByName', align: 'center', width: 100},
            {
                title: '授权', dataIndex: 'AuditSts',
                fixed: 'right',
                align: 'center',
                width: 80,
                render: (text, record) => ({
                    1: authority(resId.reAuthorizationList.confirm)(<a href='#' onClick = {() => {this.reAudit(record.RemittanceRetryAppId);}}>周薪薪打款</a>), 
                    2: <span className='color-green'>通过</span>,
                    3: <span className='color-danger'>未通过</span>,
                    4: <span className='color-danger'>数据异常</span>, 
                    5: <span>余额不足</span>
                }[text])

            }
        ];

        return (
            <div>
                {authority(resId.reAuthorizationList.reauthorization)(<Button onClick={() => {line();window._czc.push(['_trackEvent', '重发授权', '授权', '重发授权_Y结算']);}} className="ml-8" type = "primary" style = {{marginBottom: "20px"}}>授权</Button>)}
                <SearchForm 
                    {...{
                        searchValue,
                        handleFormReset,
                        onValuesChange: handleFormValuesChange,
                        handleFormSubmit: queryReAudit,
                        resetPageCurrent
                    }}
                />
                <Table
                    rowKey = {'RemittanceRetryAppId'} 
                    bordered = {true}
                    dataSource = {RecordList.slice()} 
                    rowSelection={{
                        selectedRowKeys: selectedRowKeys,
                        onChange: onSelectChange,
                        getCheckboxProps: (record) => ({ disabled: record.AuditSts === 2 || record.AuditSts === 4 || record.AuditSts === 5})
                    }}

                    loading = {FormListStatus === "pending"}
                    columns = {columns}
                    scroll={{ x: 1720, y: 550}}
                    pagination = {{
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

