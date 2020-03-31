import React, { Component } from 'react';
import { observer } from "mobx-react";
import { Table } from 'antd';
import { generateColInfo } from 'ADMIN_UTILS';

@observer
class ResTable extends Component {
    render() {
        const {
            tableInfo: {
                dataList, loading, columnsMap
            }
        } = this.props;

        const [columns, width] = generateColInfo(columnsMap.slice());

        return (
            <div>
                <Table
                    columns={columns}
                    bordered={true}
                    dataSource={dataList.slice()}
                    rowKey='RowID'
                    scroll={{ x: width, y: 550 }}
                    pagination={false}
                    loading={loading} >
                </Table>
            </div>
        );
    }
}

export default ResTable;