import React, { Component } from 'react';
import { Table } from 'antd';
import { tableDateMonthRender, tableMoneyRender } from 'ADMIN_UTILS/tableItemRender';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';
import { observer } from "mobx-react";
import { generateColInfo } from 'ADMIN_UTILS';

@observer
class ResTable extends Component {
    render() {
        const columnsMap = [
            ['EntName', '企业'],
            ['TrgtSpName', '劳务', undefined, 220],
            ['RelatedMo', '月份', tableDateMonthRender, 100],
            ['IdCardNum', '身份证号码', undefined, 150],
            ['RealName', '姓名', undefined, 100],
            ['Xmoney', 'X', tableMoneyRender, 100],
            ['Ymoney', 'Y', tableMoneyRender, 100],
            ['Amoney', 'Z', tableMoneyRender, 100],
            ['DifferenceValue', '差值((x-y)/2 - Z)', tableMoneyRender]
        ];

        const {
            tableInfo: {
                dataList, total, loading
            },
            pagination: {
                current, pageSize
            },
            setPagination
        } = this.props;

        const [columns, width] = generateColInfo(columnsMap);

        return (
            <div>
                <Table
                    columns={columns}
                    bordered={true}
                    dataSource={dataList.slice()}
                    rowKey='RowIndex'
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