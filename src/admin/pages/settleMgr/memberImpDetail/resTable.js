import React, { Component } from 'react';
import { Table } from 'antd';
import { tableDateRender, tableMoneyRender, settleTypeRender } from 'ADMIN_UTILS/tableItemRender';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';
import { observer } from "mobx-react";
import { generateColInfo } from 'ADMIN_UTILS';

@observer
class ResTable extends Component {
    render() {
        const columnsMap = [
            ['IDCardNum', '身份证号码'],
            ['RealName', '姓名'],
            ['WorkCardNo', '工号'],
            ['IntvDate', '面试日期', tableDateRender],
            ['XAmount', 'X', tableMoneyRender],
            ['PreCheckInfo', '预检测结果', undefined, 180],
            ['HourlyWorkPrice', '小时工单价'],
            ['SystemACPPrice', '系统收单工价'],
            ['SettlementTyp', '结算模式', settleTypeRender, 100]
        ];

        const {
            tableInfo: {
                dataList, loading
            }
        } = this.props;

        const [columns, width] = generateColInfo(columnsMap);

        return (
            <div>
                <Table
                    columns={columns}
                    bordered={true}
                    dataSource={dataList.slice()}
                    rowKey='Number'
                    scroll={{ x: width, y: 550 }}
                    pagination={{
                        ...tablePageDefaultOpt
                    }}
                    loading={loading} >

                </Table>
            </div>
        );
    }
}

export default ResTable;