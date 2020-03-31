import { generateColInfo, tablePageDefaultOpt } from 'ADMIN_UTILS';
import { Table } from 'antd';
import { observer } from "mobx-react";
import React, { Component } from 'react';
import { tableMoneyRender, feeTypRender, applyStsRender, tuditStsRender, tableDateRender, transferResultRender, hasReturnFeeRender, settlementTypRender, WorkStsStatus } from 'ADMIN_UTILS/tableItemRender';
@observer
class ResTable extends Component {
    render() {
        const columnsMap = [
            ['HasReturnFee', '补贴类型', hasReturnFeeRender, undefined, 'left'],
            ['SettlementTyp', '模式', settlementTypRender, undefined, 'left'],
            ['IntvDt', '面试日期', tableDateRender, undefined, 'left'],
            ['RealName', '会员姓名', undefined, undefined, 'left'],
            ['FeeTyp', '性别', feeTypRender, undefined, 'left'],
            ['WorkCardNo', '工号', undefined, undefined, 'left'],
            ['Mobile', '手机号码'],
            ['IdCardNum', '身份证'],
            ['EntName', '企业'],
            ['TrgtSpName', '劳务公司'],
            ['EntryDt', '入职日期', tableDateRender],
            ['Days', '周期'],
            ['FfEndDt', '返费结束日期', tableDateRender],
            ['LeaveDt', '离职时间', tableDateRender],
            ['WorkSts', '在离职状态', WorkStsStatus],
            ['OrderReturnFee', '订单补贴', tableMoneyRender],
            ['PredictReturnFee', '预计应付', tableMoneyRender],
            ['PaidReturnFee', '实付', tableMoneyRender],
            ['ApplySts', '申请状态', applyStsRender],
            ['AuditSts', '审核状态', tuditStsRender],
            ['TransferResult', '付款状态', transferResultRender]
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