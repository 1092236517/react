import React, { Component } from 'react';
import { observer } from "mobx-react";
import { Table } from 'antd';
import { withRouter } from 'react-router';
import { generateColInfo } from 'ADMIN_UTILS';

@withRouter
@observer
class ResTable extends Component {

    render() {
        const columnsMap = [
            ['EntShortName', '企业'],
            ['SpShortName', '劳务'],
            ['PayNumbers', '上次发薪在职人数']
        ];

        const {
            tableInfo: {
                dataList, total, loading
            },
            startQuery
        } = this.props;

        const [columns] = generateColInfo(columnsMap);

        return (
            <div>
                <Table
                    columns={columns}
                    bordered={true}
                    dataSource={dataList.slice()}
                    rowKey='BillWeeklyBatchDetailId'
                    loading={loading}
                    pagination={false}
                    refreshData={startQuery} >
                </Table>
            </div>
        );
    }
}

export default ResTable;