import React, { Component } from 'react';
import { observer } from "mobx-react";
import { Table } from 'antd';
import { tableDateRender, tableWorkStateRender, tableSrcRender, tableMoneyRender } from 'ADMIN_UTILS/tableItemRender';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';

@observer
class ResTable extends Component {
    //  中介费到账记录跳转时隐藏   ClockDays  ClockAmt  LaborConfirmedAmt   PlatformSrvcAmt
    generateColInfo = (columnsMap, from) => {
        let columns = [];
        let allWidth = 0;
        columnsMap.forEach((aColumn) => {
            const [dataIndex, title, render = null, width = 130, fixed = null, align = 'center'] = aColumn;
            const hideColumns = ['ClockDays', 'ClockAmt', 'LaborConfirmedAmt', 'AdvancePayAmt', 'PlatformSrvcAmt'];
            if (!(from == 'agentSee' && hideColumns.includes(dataIndex))) {
                columns.push({ dataIndex, title, render, align, width, fixed });
                allWidth += width;
            }
        });
        return [columns, allWidth];
    };

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
            ['WorkSts', '在职状态', tableWorkStateRender, 80],
            ['LeaveDt', '离职/转正/自离日期', tableDateRender, 150],
            ['PreCheckInfo', '预检测结果', undefined, 180],
            ['ClockDays', '打卡天数', undefined, 100],
            ['ClockAmt', '打卡周薪(元)', tableMoneyRender, 100],
            ['CreditSubsidyAmt', '信用补贴总金额(元)', tableMoneyRender, 150],
            ['LaborConfirmedAmt', '劳务确认金额(元)', tableMoneyRender],
            ['AdvancePayAmt', '应发周薪(元)', tableMoneyRender, 100],
            ['AgentAmt', '服务费(元)', tableMoneyRender, 100],
            ['PlatformSrvcAmt', '平台费(元)', tableMoneyRender, 100],
            ['Remark', '备注'],
            ['BillSrce', '录入类型', tableSrcRender, 80]
        ];

        const {
            view: {
                tableInfo: {
                    dataList, total, loading
                },
                pagination: {
                    current, pageSize
                },
                from
            },
            startQuery,
            setPagination
        } = this.props.weeklyWageBillDetailStore;

        const [columns, width] = this.generateColInfo(columnsMap);

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