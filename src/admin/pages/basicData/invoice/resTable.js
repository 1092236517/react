import React, { Component } from 'react';
import { observer } from "mobx-react";
import { Table } from 'antd';
import { tableDateTimeRender } from 'ADMIN_UTILS/tableItemRender';
import { tablePageDefaultOpt, generateColInfo } from 'ADMIN_UTILS';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';

@observer
class ResTable extends Component {
    render() {
        const { editX, historyX } = resId.basicData.invoice;
        const {
            tableInfo: {
                dataList, total, loading, selectedRowKeys
            },
            pagination: {
                current, pageSize
            },
            setPagination,
            setSelectRowKeys,
            editInvoice,
            historyInvoice
        } = this.props;

        const columnsMap = [
            ['TrgtSpShortName', '劳务', undefined, undefined, 'left'],
            ['EntShortName', '企业', undefined, undefined, 'left'],
            ['InvoiceTyp', '开票类型', (val) => ({ 1: '普票', 2: '专票' }[val] || '')],
            ['TrgtCn', '劳务名称'],
            ['TrgtCnShort', '劳务简称'],
            ['EntCn', '企业名称'],
            ['EntCnShort', '企业简称'],
            ['TaxpayerId', '纳税人识别号'],
            ['AccntBank', '开户行'],
            ['AccntNum', '开户账号'],
            ['Address', '地址'],
            ['TelPhone', '联系电话'],
            ['Operator', '操作人'],
            ['OperatorTm', '操作时间', tableDateTimeRender, 160],
            ['AuditSts', '审核状态', (val) => ({ 1: '待审核', 2: '审核通过', 3: '审核不通过' }[val] || '')],
            ['Auditer', '审核人', undefined, 100],
            ['AuditTm', '审核时间', tableDateTimeRender, 160],
            ['Action', '操作', (val, record) => (authority(editX)(<a href='javascript:;' onClick={editInvoice.bind(this, record)}>编辑</a>)), 80],
            ['History', '历史版本', (val, record) => (authority(historyX)(<a href='javascript:;' onClick={historyInvoice.bind(this, record)}>查看</a>)), 80]
        ];

        const [columns, width] = generateColInfo(columnsMap);

        return (
            <div>
                <Table
                    columns={columns}
                    bordered={true}
                    dataSource={dataList.slice()}
                    rowKey='DataId'
                    scroll={{ x: width + 62, y: 550 }}
                    pagination={{
                        ...tablePageDefaultOpt,
                        current,
                        pageSize,
                        total,
                        onShowSizeChange: (current, size) => {
                            setPagination(current, size);
                        },
                        onChange: (page, pageSize) => {
                            setPagination(page, pageSize);
                        }
                    }}
                    rowSelection={{
                        selectedRowKeys: selectedRowKeys,
                        onChange: (selectedRowKeys, selectedRows) => {
                            setSelectRowKeys(selectedRowKeys, selectedRows);
                        },
                        getCheckboxProps: (record) => ({ disabled: record.AuditSts !== 1 })
                    }}
                    loading={loading} >
                </Table>
            </div>
        );
    }
}

export default ResTable;