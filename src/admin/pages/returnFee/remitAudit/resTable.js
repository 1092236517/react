import React, { Component } from 'react';
import { Table } from 'antd';
import { tableMoneyRender, tableDateRender, tableWorkStateRender, tableDateTimeRender, settleTypeRender } from 'ADMIN_UTILS/tableItemRender';
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
            ['PaidSalary', '打款金额', tableMoneyRender, 100],
            ['PaidDt', '打款日期', tableDateRender, 100],
            ['BankName', '银行名称'],
            ['BankCardNum', '银行卡号'],
            ['Remark', '备注'],
            ['PreCheck', '预检测结果', undefined, 180],
            ['AuditSts', '审核状态', (text) => ({ 1: '未审核', 2: '审核通过', 3: '审核不通过', 4: '系统审核不通过' }[text])],
            ['AuditName', '审核人'],
            ['AuditTm', '审核时间', tableDateTimeRender, 150],
            ['SettlementTyp', '模式', settleTypeRender, 80]
        ];

        const {
            tableInfo: {
                dataList, loading, total, selectedRowKeys
            },
            pagination: {
                current,
                pageSize
            },
            setPagination,
            setSelectRowKeys
        } = this.props;

        const [columns, width] = generateColInfo(columnsMap);

        return (
            <div>
                <Table
                    columns={columns}
                    bordered={true}
                    dataSource={dataList.slice()}
                    rowKey='DataId'
                    scroll={{ x: width + 62, y: 550 }}
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
                    rowSelection={{
                        selectedRowKeys: selectedRowKeys,
                        onChange: (selectedRowKeys, selectedRows) => {
                            setSelectRowKeys(selectedRowKeys, selectedRows);
                        },
                        getCheckboxProps: (record) => ({ disabled: !(record.AuditSts == 1) })
                    }}
                    loading={loading} >
                </Table>
            </div>
        );
    }
}

export default ResTable;