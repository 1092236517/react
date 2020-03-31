import React, { Component } from 'react';
import { observer } from "mobx-react";
import { Table } from 'antd';
import { tableDateTimeRender, tableDateMonthRender, tableMoneyRender } from 'ADMIN_UTILS/tableItemRender';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import { generateColInfo } from 'ADMIN_UTILS';

@observer
class ResTable extends Component {
    render() {
        const { editAccountX } = resId.basicData.memberPayAccount;
        const {
            tableInfo: {
                dataList, total, loading
            },
            pagination: {
                current, pageSize
            },
            setPagination,
            editAccount
        } = this.props;

        const columnsMap = [
            ['RelatedMo', '归属月份', tableDateMonthRender, 160],
            ['EntName', '企业'],
            ['TrgtSpName', '劳务'],
            ['GenerateTm', '录入时间', tableDateTimeRender, 160],
            ['TransferTm', '银行打款时间', tableDateTimeRender, 160],
            ['GenerateByName', '录入人', undefined, 100],
            ['SplitTyp', '拆分类型', (value) => ({ 1: 'z拆分', 2: '押金', 3: 'zx拆分', 4: '利润拆分', 5: '退税', 6: '返费风险金' }[value])],
            ['OprTyp', '操作类型', (value) => ({ 1: '充值', 2: '提现' }[value])],
            ['MoneyContext', '金额', (text, record) => <span dangerouslySetInnerHTML={{ __html: text ? JSON.stringify(text).replace(/\\n/g, "<br />").replace(/\"/g, "") : '' }}></span >, 120],
            ['AuditByName', '审核人', undefined, 100],
            ['AuditTm', '审核时间', tableDateTimeRender, 160]
        ];

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