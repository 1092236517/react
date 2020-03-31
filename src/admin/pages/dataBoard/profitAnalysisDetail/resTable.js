import { generateColInfo, tablePageDefaultOpt } from 'ADMIN_UTILS';
import { Table } from 'antd';
import { observer } from "mobx-react";
import React, { Component } from 'react';
import { tableDateRender, tableMoneyRender, modelTransform, isSecondEntry } from 'ADMIN_UTILS/tableItemRender';
import 'ADMIN_ASSETS/less/pages/dataBoard.less';
@observer
class ResTable extends Component {
    setDetails = (text, record) => {
        this.props.setSynchVisibleValue(text);
        console.log(text);
        this.props.setSynchVisible(true);
        window._czc.push(['_trackEvent', 'zx盈利分析明细表', '订单详情', 'zx盈利分析明细表_N非结算']);
    }
    render() {
        const columnsMap = [
            ['RcrtOrderId', '订单号'],
            ['TrgtSpName', '劳务'],
            ['EntName', '企业'],
            ['SettlementTyp', '模式', modelTransform],
            ['RealName', '姓名'],
            ['IdCardNum', '身份证号码'],
            ['JffSpEntName', '工种'],
            ['OrderDetail', '订单详情', (text, record) => (
                record.OrderDetail ? <a className="line-clamp" style={{ WebkitBoxOrient: 'vertical' }} onClick={() => this.setDetails(text, record)}>{text}</a> : ''
            )],
            ['OrderEndDt', '订单结束日期', tableDateRender, 100],
            ['WorkCardNo', '工号'],
            ['IntvDt', '面试日期', tableDateRender, 100],
            ['EntryDt', '入职日期', tableDateRender, 100],
            ['LeaveDt', '离职/转正日期', tableDateRender, 100],
            ['XMoney', 'X', tableMoneyRender],
            ['AdvancePayAmt', '已发周薪', tableMoneyRender],
            ['RemainingSalary', '剩余月薪', tableMoneyRender],
            ['ReturnFee', '返费', tableMoneyRender],
            ['ReturnFeeMaxDays', '返费天数(应)'],
            ['TotReturnFee', '返费金额(应)', tableMoneyRender],
            ['YMoney', 'Y', tableMoneyRender],
            ['Profit', '盈利(X-Y)/2', tableMoneyRender],
            ['AgentFee', '中介费', tableMoneyRender],
            ['WorkDays', '在职天数'],
            ['IsSecondEntry', '是否二次入职', isSecondEntry]
        ];

        const {
            pagination: {
                current, pageSize
            },
            tableInfo: { dataList, total, loading },
            setPagination
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