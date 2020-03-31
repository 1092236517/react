import React, { Component } from 'react';
import { observer } from "mobx-react";
import { Table } from 'antd';
import { tableDateTimeRender, tableMoneyRender } from 'ADMIN_UTILS/tableItemRender';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import { generateColInfo } from 'ADMIN_UTILS';
import 'ADMIN_ASSETS/less/pages/cars.less';
@observer
class ResTable extends Component {
    render() {
        const { editAccountX } = resId.basicData.memberPayAccount;
        const {
            tableInfo: {
                dataList, total, loading
            },
            pagination: {
                current, pageSize
            },
            setPagination,
            editAccount
        } = this.props;

        const columnsMap = [
            ['RealName', '姓名'],
            ['IdCardNum', '身份证号码'],
            ['Mobile', '手机号码'],
            ['PayAmt', '金额', tableMoneyRender],
            ['PaySts', '支付状态', (text) => ({ 1: <span className='successSatus'>成功</span>, 2: <span className='failStatus'>失败</span> })[text], 80],
            ['PayTm', '支付时间', tableDateTimeRender, 160],
            ['PayFailReason', '失败原因', undefined, 100]
        ];

        const [columns, width] = generateColInfo(columnsMap);

        return (
            <div>
                <Table
                    columns={columns}
                    bordered={true}
                    dataSource={dataList.slice()}
                    rowKey='PayAccntRouterId'
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