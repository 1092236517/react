import { generateColInfo, tablePageDefaultOpt } from 'ADMIN_UTILS';
import { Table } from 'antd';
import { observer } from "mobx-react";
import React, { Component } from 'react';
import { tableDateRender, tableMoneyRender } from 'ADMIN_UTILS/tableItemRender';
@observer
class ResTable extends Component {
    render() {
        const columnsMap = [
            ['TrgtSpName', '劳务'],
            ['EntName', '企业'],
            ['QuitSalary', '自离工资', tableMoneyRender],
            ['AdvancePayAmt', '已发周薪(自离当月)', tableMoneyRender],
            ['QuitProfit', '自离利润', tableMoneyRender],
            ['QuitNumber', '自离人数'],
            ['EntryNumber', '入职人数'],
            ['PersonQuitProfit', '人均自离利润', tableMoneyRender],
            ['QuitNumberPercent', '自离人数占比', (text, record) => (
                record.QuitNumberPercent + ' %'
            )]
        ];

        const {
            pagination: {
                current, pageSize
            },
            tableInfo: { dataList, total, loading },
            setPagination
        } = this.props;
        const [columns, width] = generateColInfo(columnsMap);
        return (
            <div>
                <Table
                    columns={columns}
                    bordered={true}
                    dataSource={dataList.slice()}
                    rowKey='DataId'
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