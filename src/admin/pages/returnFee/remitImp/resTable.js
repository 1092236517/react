import React, { Component } from 'react';
import { Table } from 'antd';
import { tableMoneyRender, tableDateRender, tableWorkStateRender, settleTypeRender } from 'ADMIN_UTILS/tableItemRender';
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
            ['SettlementTyp', '模式', settleTypeRender, 80]
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
                    rowKey='DataId'
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