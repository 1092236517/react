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
    }

    render() {
        const { operDataX } = resId.weeklyWageManager.leak;

        const columnsMap = [
            ['BeginDt', '开始日期', tableDateRender, 100],
            ['EndDt', '截止日期', tableDateRender, 100],
            ['EntShortName', '企业'],
            ['TrgtSpShortName', '劳务', undefined, 220],
            ['SrceSpShortName', '中介', undefined, 220],
            ['RealName', '姓名', undefined, 100],
            ['IdCardNum', '身份证号码', undefined, 150],
            ['IntvDt', '面试日期', tableDateRender, 100],
            ['EntryDt', '入职日期', tableDateRender, 100],
            ['LeaveDt', '离职日期', tableDateRender, 100],
            ['WorkSts', '在职状态', (value) => ({ 1: '在职', 2: '离职', 3: '转正', 4: '未处理', 5: '未知', 6: '自离' }[value]), 120]
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
                        ...tablePageDefaultOpt
                        // current,
                        // pageSize,
                        // total,
                        // onShowSizeChange: (current, size) => {
                        //     setPagination(current, size);
                        // },
                        // onChange: (page, pageSize) => {
                        //     setPagination(page, pageSize);
                        // }
                    }}
                    // rowSelection={{
                    //     selectedRowKeys: selectedRowKeys,
                    //     onChange: (selectedRowKeys, selectedRows) => {
                    //         setSelectRowKeys(selectedRowKeys, selectedRows);
                    //     }
                    // }}
                    loading={loading}
                    refreshData={startQuery} >
                </Table>
            </div>
        );
    }
}

export default ResTable;