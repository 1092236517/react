import { generateColInfo, tablePageDefaultOpt } from 'ADMIN_UTILS';
import { Table } from 'antd';
import { observer } from "mobx-react";
import React, { Component } from 'react';
import { tableMoneyRender } from 'ADMIN_UTILS/tableItemRender';
@observer
class ResTable extends Component {
    render() {
        const columnsMap = [
            ['TrgtSpName', '劳务'],
            ['EntName', '企业'],
            ['TolX', '合计X', tableMoneyRender],
            ['AdvancePayAmt', '已发周薪', tableMoneyRender],
            ['RemainingSalary', '剩余月薪', tableMoneyRender],
            ['ReturnFee', '返费', tableMoneyRender],
            ['TolY', '合计支出Y', tableMoneyRender],
            ['Profit', '盈利(X-Y)/2', tableMoneyRender],
            ['AgentAmt', '中介费Z', tableMoneyRender],
            ['EntryNumber', '入职人数'],
            ['WorkDays', '在职天数'],
            ['EveryDayProfit', '每人每天盈利', tableMoneyRender],
            ['EveryDayZ', '每人每天Z', tableMoneyRender],
            ['Difference', '差异', tableMoneyRender]
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