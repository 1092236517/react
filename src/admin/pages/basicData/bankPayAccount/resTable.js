import React, { Component } from 'react';
import { observer } from "mobx-react";
import { Table } from 'antd';
import { tableDateTimeRender } from 'ADMIN_UTILS/tableItemRender';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import { generateColInfo } from 'ADMIN_UTILS';

@observer
class ResTable extends Component {
    render() {
        const { editAccount } = this.props.bankPayAccountStore;
        const { editAccountX } = resId.basicData.bankPayAccount;

        const columnsMap = [
            ['BankCardNum', '付款账号', undefined, 180],
            ['BankAccntName', '付款账号名称'],
            ['BankName', '开户行名称'],
            ['IsValide', '是否有效', (text) => ({ 1: '有效', 2: '无效' }[text]), 80],
            ['CreatedTm', '创建时间', tableDateTimeRender, 150],
            ['CreatedBy', '创建人', undefined, 100],
            ['Action', '修改', (text, record) => (
                authority(editAccountX)(<a href='javascript:;' onClick={() => { editAccount(record); window._czc.push(['_trackEvent', '银行付款账号管理', '修改', '银行付款账号管理_Y结算']); }}>修改</a>
                )), 80]
        ];

        const {
            view: {
                tableInfo: {
                    dataList, total, loading, selectedRowKeys
                },
                pagination: {
                    current, pageSize
                }
            },
            setPagination,
            setSelectRowKeys
        } = this.props.bankPayAccountStore;

        const [columns, width] = generateColInfo(columnsMap);

        return (
            <div>
                <Table
                    columns={columns}
                    bordered={true}
                    dataSource={dataList.slice()}
                    rowKey='PayAccntId'
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
                        }
                    }}
                    loading={loading} >
                </Table>
            </div>
        );
    }
}

export default ResTable;