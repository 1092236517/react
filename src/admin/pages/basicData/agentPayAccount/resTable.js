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
        const { editAccount } = this.props.agentPayAccountStore;
        const { editAccountX } = resId.basicData.agentPayAccount;

        const columnsMap = [
            ['SpName', '中介名称'],
            ['PayAccntName', '付款银行账号名称'],
            ['BankVirtualSubAccnt', '虚拟子账户'],
            ['BankVirtualSubAccntName', '虚拟子账户名称'],
            ['CreatedTm', '创建时间', tableDateTimeRender, 150],
            ['CreatedBy', '创建人', undefined, 100],
            ['Action', '修改', (text, record) => (authority(editAccountX)(<a href='javascript:;' onClick={() => { editAccount(record); window._czc.push(['_trackEvent', '中介打款虚拟子账户', '修改', '中介打款虚拟子账户_N非结算']); }}>修改</a>)), 80]
        ];

        const {
            view: {
                tableInfo: {
                    dataList, total, loading
                },
                pagination: {
                    current, pageSize
                }
            },
            setPagination
        } = this.props.agentPayAccountStore;

        const [columns, width] = generateColInfo(columnsMap);

        return (
            <div>
                <Table
                    columns={columns}
                    bordered={true}
                    dataSource={dataList.slice()}
                    rowKey='PayAccntRouterId'
                    scroll={{ x: width, y: 550 }}
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
                    loading={loading} >
                </Table>
            </div>
        );
    }
}

export default ResTable;