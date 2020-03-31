import React, { Component } from 'react';
import { Table } from 'antd';
import { tableDateMonthRender, tableDateTimeRender, tableMoneyRender } from 'ADMIN_UTILS/tableItemRender';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';
import { observer } from "mobx-react";
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import { generateColInfo } from 'ADMIN_UTILS';

const auditRender = (value) => ({ 1: '未审核', 2: '审核通过', 3: '审核不通过' }[value]);

@observer
class ResTable extends Component {
    editConfig = (record) => {
        const { showModal } = this.props;
        const { LaborId, EntId, Details } = record;
        window._czc.push(['_trackEvent', '中介费配置', '编辑', '中介费配置_N非结算']);
        showModal({
            LaborId,
            EntId,
            AgentInfo: Details
        });
    }

    render() {
        const { editX } = resId.settleMgr.configAgentA;

        const columnsMap = [
            ['LaborIdName', '劳务', undefined, 220],
            ['EntName', '企业'],
            ['Details', 'a-中介费', (value, record) => (
                <div>
                    {
                        value.map(({ AgentAmt, BeginDt, EndDt }, index) => (
                            <p key={index} style={{ margin: 0 }}>{tableDateMonthRender(BeginDt)} ~ {EndDt == '2099-01-01' ? '永久' : tableDateMonthRender(EndDt)} , {tableMoneyRender(AgentAmt)}元/天</p>
                        ))
                    }
                </div>
            ), 300],
            ['AuditSts', '审核状态', auditRender, 80],
            ['AuditByName', '审核人', undefined, 100],
            ['AuditTm', '审核时间', tableDateTimeRender, 150],
            ['AuditRemark', '审核备注'],
            ['Action', '操作', (value, record) => record.AuditSts != 2 && authority(editX)(<a type='primary' onClick={this.editConfig.bind(this, record)}>编辑</a>), 80]
        ];

        const {
            tableInfo: {
                dataList, total, loading, selectedRowKeys, selectedRows
            },
            pagination: {
                current, pageSize
            },
            setPagination,
            setSelectRowKeys
        } = this.props;

        const [columns, width] = generateColInfo(columnsMap);

        return (
            <div>
                <Table
                    columns={columns}
                    bordered={true}
                    dataSource={dataList.slice()}
                    rowKey='RowIndex'
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
                        getCheckboxProps: (record) => ({ disabled: record.AuditSts == 2 })
                    }}
                    loading={loading} >
                </Table>
            </div>
        );
    }
}

export default ResTable;