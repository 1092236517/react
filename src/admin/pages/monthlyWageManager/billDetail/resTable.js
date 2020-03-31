import React, { Component } from 'react';
import { observer } from "mobx-react";
import { Table } from 'antd';
import { tableDateRender, tableDateMonthRender, tableSrcRender, tableWorkStateRender, tableMoneyRender, tableMonthTypeRender } from 'ADMIN_UTILS/tableItemRender';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';
import { generateColInfo } from 'ADMIN_UTILS';

@observer
class ResTable extends Component { 
    render() {
        const columnsMap = [
            ['RealName', '姓名', undefined, 100, 'left'],
            ['BillMonthlyBatchId', '批次号', undefined, 100],
            ['BillRelatedMo', '归属月份', tableDateMonthRender, 100],
            ['EntShortName', '企业'],
            ['TrgtSpShortName', '劳务', undefined, 220],
            ['SrceSpName', '中介', undefined, 220],
            ['IdCardNum', '身份证号码', undefined, 150],            
            ['WorkCardNo', '工号'],
            ['EntryDt', '入职时间', tableDateRender, 100],
            ['WorkSts', '在职状态', tableWorkStateRender, 80],
            ['LeaveDt', '离职/转正/自离日期', tableDateRender, 150],
            ['PreCheckInfo', '预检测结果', undefined, 180],
            ['TrgtSpMonthlyPaidSalary', '实发工资(元)', tableMoneyRender],
            ['TotSalary', '应发总工资(元)', tableMoneyRender],
            ['WeeklyPaidAmt', '已支生活费(元)', tableMoneyRender],
            ['MonthlyPaidAmt', '已发工资(元)', tableMoneyRender],
            ['IdealRemainingSalary', '理论剩余工资(元)', tableMoneyRender],
            ['RemainingSalary', '实际剩余工资(元)', tableMoneyRender],
            ['SalaryTyp', '月薪类型', tableMonthTypeRender],
            ['PlatformSrvcAmt', '平台费(元)', tableMoneyRender],
            ['RemainingAgentAmt', '服务费(元)', tableMoneyRender, 100],
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
                }
            },
            setPagination
        } = this.props.monthlyWageBillDetailStore;

        const [columns, width] = generateColInfo(columnsMap);

        return (
            <div>
                <Table
                    columns={columns}
                    bordered={true}
                    dataSource={dataList.slice()}
                    rowKey='BillMonthlyBatchDetailId'
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