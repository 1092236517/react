import React, { Component } from 'react';
import { observer } from "mobx-react";
import { Table } from 'antd';
import { tableDateRender, tableDateTimeRender, tableDateMonthRender, tableMoneyRender } from 'ADMIN_UTILS/tableItemRender';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import { generateColInfo } from 'ADMIN_UTILS';

@observer
class ResTable extends Component {
    handleData = (id) => {
        const { showModal } = this.props;
        showModal([id]);
        window._czc.push(['_trackEvent', '月薪查漏', '列表操作', '月薪查漏_Y结算']);
    }

    render() {
        const { operDataX } = resId.monthlyWageManager.leak;

        const columnsMap = [
            ['Month', '月份', tableDateMonthRender, 100],
            ['EntShortName', '企业'],
            ['TrgtSpShortName', '劳务', undefined, 220],
            ['SrceSpShortName', '中介', undefined, 220],
            ['RealName', '姓名', undefined, 100],
            ['WorkCardNo', '工号', undefined, 100],
            ['Mobile', '手机号', undefined, 120],
            ['IdCardNum', '身份证号码', undefined, 150],
            ['PaidAmt', '已借支金额', tableMoneyRender, 100],
            ['WorkName', '工种', undefined, 100],
            ['WorkState', '在职状态', undefined, 100],
            ['SystemPrice', '系统工价', undefined, 100],
            ['SettlementType', '结算方式', undefined, 100],
            ['IntvDate', '面试日期', tableDateRender, 100],
            ['PositiveDate', '预计转正日期', tableDateRender, 100],
            ['EntryDt', '入职日期', tableDateRender, 100],
            ['LeaveDt', '离职日期', tableDateRender, 100],
            ['Operator', '操作人', undefined, 100],
            ['OperationTm', '操作时间', tableDateTimeRender, 150],
            ['OperationSts', '处理状态', (value) => ({ 1: '未处理', 2: '处理正常', 3: '处理异常' }[value]), 80, 'right'],
            ['Remark', '备注', undefined, undefined, 'right'],
            ['Action', '操作', (value, record) => (authority(operDataX)(<a href='#' onClick={this.handleData.bind(this, record.DataId)}>操作</a>)), 80, 'right']
        ];

        const {
            tableInfo: {
                dataList, total, loading, selectedRowKeys
            },
            pagination: {
                current, pageSize
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
                        }
                    }}
                    loading={loading} >
                </Table>
            </div>
        );
    }
}

export default ResTable;