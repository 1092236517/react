import React, { Component } from 'react';
import { observer } from "mobx-react";
import { Table } from 'antd';
import { tableDateRender, tableWorkStateRender, tableSrcRender, tableMoneyRender, tableBillAuditRender, settleTypeRender } from 'ADMIN_UTILS/tableItemRender';
import { tablePageDefaultOpt, generateColInfo } from 'ADMIN_UTILS';
import { withRouter } from 'react-router';

@observer
class ResTable extends Component {
    render() {
        const columnsMap = [
            ['RealName', '姓名', undefined, 100, 'left'],
            ['BillWeeklyBatchId', '批次号', undefined, 100],
            ['BeginDt', '开始时间', tableDateRender, 100],
            ['EndDt', '结束时间', tableDateRender, 100],
            ['EntShortName', '企业'],
            ['TrgtSpShortName', '劳务', undefined, 220],
            ['SrceSpShortName', '中介', undefined, 220],
            ['IdCardNum', '身份证号码', undefined, 150],
            ['WorkCardNo', '工号'],
            ['EntryDt', '入职时间', tableDateRender, 100],
            ['WorkSts', '在职状态', tableWorkStateRender],
            ['LeaveDt', '离职/转正/自离日期', tableDateRender, 150],
            ['PreCheckInfo', '预检测结果', undefined, 180],
            ['ClockDays', '打卡天数', undefined, 80],
            ['ClockAmt', '打卡周薪(元)', tableMoneyRender, 100],
            ['UserAmountBeforeTax', '税前周薪(元)', tableMoneyRender, 100],
            ['TaxRate', '税率', undefined, 100],
            ['TaxAmount', '扣税金额(元)', tableMoneyRender, 100],
            ['TaxAfter', '税后周薪(元)', tableMoneyRender, 100],
            ['AgentAmt', '服务费(元)', tableMoneyRender, 80],
            ['PlatformSrvcAmt', '平台费(元)', tableMoneyRender, 80],
            ['AuditSts', '审核状态', tableBillAuditRender, 80],
            ['Remark', '备注'],
            ['AuditDt', '账单审核日期', tableDateRender, 100],
            ['BillSrce', '录入类型', tableSrcRender, 80]
        ];

        const {
            tableInfo: {
                dataList, total, loading
            },
            pagination: {
                current, pageSize
            },
            startQuery,
            setPagination
        } = this.props;

        const [columns, width] = generateColInfo(columnsMap);

        return (
            <div>
                <Table
                    columns={columns}
                    bordered={true}
                    dataSource={dataList.slice()}
                    rowKey='BillWeeklyBatchDetailId'
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
                    loading={loading}
                    refreshData={startQuery} >
                </Table>
            </div>
        );
    }
}

export default ResTable;