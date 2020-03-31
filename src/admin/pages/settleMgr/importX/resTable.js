import React, { Component } from 'react';
import { Table } from 'antd';
import { tableMoneyRender, settleTypeRender } from 'ADMIN_UTILS/tableItemRender';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';
import { observer } from "mobx-react";
import { generateColInfo } from 'ADMIN_UTILS';

@observer
class ResTable extends Component {
    render() {
        const columnsMap = [
            ['IDCardNum', '身份证号码'],
            ['WorkStateText', '在离职状态'],
            ['RealName', '姓名'],
            ['WorkCardNo', '工号'],
            ['XAmount', 'X', tableMoneyRender],
            ['PreCheckInfo', '预检测结果', undefined, 180],
            ['ACPPrice', '收单工价'],
            ['SystemACPPrice', '系统收单工价'],
            ['RecvReturnFee', '收单返费'],
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