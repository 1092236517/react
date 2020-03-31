import React, { Component } from 'react';
import { observer } from "mobx-react";
import { Table } from 'antd';
import { tableDateRender, tableDateTimeRender, tableMoneyRender, tableWorkStateRender, tableYesNoRender, tableSrcRender } from 'ADMIN_UTILS/tableItemRender';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';
import { generateColInfo } from 'ADMIN_UTILS';

@observer
class ResTable extends Component {
    render() {
        const columnsMap = [
            ['BillWeeklyBatchId', '批次号', undefined, 100],
            ['BeginDt', '开始时间', tableDateRender, 100],
            ['EndDt', '结束时间', tableDateRender, 100],
            ['EntShortName', '企业'],
            ['TrgtSpShortName', '劳务', undefined, 220],
            ['SrceSpShortName', '中介', undefined, 220],
            ['IdCardNum', '身份证号码', undefined, 150],
            ['RealName', '姓名', undefined, 100],
            ['WorkCardNo', '工号'],
            ['EntryDt', '入职时间', tableDateRender, 100],
            ['WorkSts', '在职状态', tableWorkStateRender],
            ['LeaveDt', '离职/转正/自离日期', tableDateRender, 150],
            ['SettlementTyp', '结算模式', undefined, 80],
            ['JffSpEntName', '工种', undefined, 80],
            ['PreCheckInfo', '预检测结果', undefined, 180],
            ['IsJoin', '加入对账单', tableYesNoRender, 100],
            ['LaborConfirmedAmt', '劳务确认金额(元)', tableMoneyRender],
            ['Remark', '备注'],
            ['CreatedByName', '操作人', undefined, 100],
            ['CreatedTm', '操作时间', tableDateTimeRender, 150],
            ['IntvDate', '面试日期', tableDateRender, 100],
            ['PositiveDate', '预计转正日期', tableDateRender, 100],
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
        } = this.props.weeklyWageImportRecordStore;

        const [columns, width] = generateColInfo(columnsMap);

        return (
            <div>
                <Table
                    columns={columns}
                    bordered={true}
                    dataSource={dataList.slice()}
                    rowKey='BillWeeklyBatchImportDetailId'
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
