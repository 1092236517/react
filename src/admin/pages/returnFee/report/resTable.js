import React, { Component } from 'react';
import { Table } from 'antd';
import { tableMoneyRender, tableDateRender, tableWorkStateRender, settleTypeRender } from 'ADMIN_UTILS/tableItemRender';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';
import { observer } from "mobx-react";
import { generateColInfo } from 'ADMIN_UTILS';

@observer
class ResTable extends Component {
    render() {
        const columnsMap = [
            ['RealName', '姓名', undefined, 100],
            ['IdCardNum', '身份证号码', undefined, 150],
            ['WorkCardNo', '工号', undefined, 100],
            ['EntShortName', '企业'],
            ['TrgtSpShortName', '劳务', undefined, 220],
            ['IntvDt', '面试日期', tableDateRender, 100],
            ['EntryDt', '入职日期', tableDateRender, 100],
            ['WorkSts', '在职状态', tableWorkStateRender, 80],
            ['LeaveDt', '离职/转正日期', tableDateRender],
            ['AllSalary', '金额应发', tableMoneyRender, 100],
            ['ThisTimeSalary', '当前应发', tableMoneyRender, 100],
            ['PaidSalary', '实发', tableMoneyRender, 100],
            ['NotPaySalary', '未结', tableMoneyRender, 100],
            ['IsOver', '是否结清', (text) => ({ 1: '未结清', 2: '已结清' }[text])],
            ['SettlementTyp', '模式', settleTypeRender, 80]
        ];

        const {
            tableInfo: {
                dataList, loading, total
            },
            pagination: {
                current,
                pageSize
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
                    rowKey='FfSummaryId'
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