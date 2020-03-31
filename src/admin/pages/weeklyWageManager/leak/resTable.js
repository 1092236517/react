import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import { generateColInfo, tablePageDefaultOpt } from 'ADMIN_UTILS';
import { tableDateRender, tableMoneyRender } from 'ADMIN_UTILS/tableItemRender';
import { Table } from 'antd';
import { observer } from "mobx-react";
import React, { Component } from 'react';
@observer
class ResTable extends Component {
    handleData = (id) => {
        const { showModal } = this.props;
        showModal([id]);
        window._czc.push(['_trackEvent', '周薪查漏', '表格操作', '周薪查漏_Y结算']);
    }

    render() {
        const { operDataX } = resId.weeklyWageManager.leak;

        const columnsMap = [
            ['BeginDt', '开始日期', tableDateRender, 100],
            ['EndDt', '截止日期', tableDateRender, 100],
            ['EntShortName', '企业'],
            ['TrgtSpShortName', '劳务', undefined, 220],
            ['SrceSpShortName', '中介', undefined, 220],
            ['Name', '姓名', undefined, 100],
            ['WorkCardNo', '工号'],
            ['Mobile', '手机号', undefined, 120],
            ['IdCardNum', '身份证号码', undefined, 150],
            ['IntvDt', '面试日期', tableDateRender, 100],
            ['EntryDt', '入职日期', tableDateRender, 100],
            ['LeaveDdt', '离职日期', tableDateRender, 100],
            ['IsLstWk', '上周在职情况', (value) => ({ 1: '在职', 2: '' }[value]), 120],
            ['ClockDays', '有效打卡天数', undefined, 100],
            ['WeekClockAmt', '预估周薪总数', tableMoneyRender, 100],
            ['Operator', '操作人', undefined, 150],
            ['OperationTm', '操作日期', tableDateRender, 100],
            ['OperationSts', '处理状态', (value) => ({ 1: '未处理', 2: '处理正常', 3: '处理异常' }[value]), 80, 'right'],
            ['Remark', '备注', undefined, undefined, 'right'],
            ['Action', '操作', (value, record) => (authority(operDataX)(<a href='#' onClick={this.handleData.bind(this, record.RowId)}>操作</a>)), 80, 'right']
        ];

        const {
            dataList, total, loading, selectedRowKeys, current, pageSize, startQuery, setPagination, setSelectRowKeys } = this.props;

        const [columns, width] = generateColInfo(columnsMap);

        return (
            <div>
                <Table
                    columns={columns}
                    bordered={true}
                    dataSource={dataList.slice()}
                    rowKey='RowId'
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
                    rowSelection={{
                        selectedRowKeys: selectedRowKeys,
                        onChange: (selectedRowKeys, selectedRows) => {
                            setSelectRowKeys(selectedRowKeys, selectedRows);
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