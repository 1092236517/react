import React, { Component } from 'react';
import { observer } from "mobx-react";
import { Table } from 'antd';
import { tableDateRender, tableWorkStateRender, tableSrcRender, tableMoneyRender, tableBillAuditRender, settleTypeRender } from 'ADMIN_UTILS/tableItemRender';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';
import { withRouter } from 'react-router';
import { generateColInfo } from 'ADMIN_UTILS';

@withRouter
@observer
class ResTable extends Component {
    //  跳转至发薪列表
    jumpToPay = (record) => {
        const { history } = this.props;
        let params = {
            BatchID: record.BillWeeklyBatchId,
            RealName: record.RealName,
            TradeType: 1
        };
        window._czc.push(['_trackEvent', '周薪查询', '跳转到发薪页面', '周薪查询_Y结算']);
        //  通过push携带state存在bug，必须发薪tab页存在时才有效，可能是封装的框架组件造成的
        sessionStorage.setItem('TEMP_JUMP_PARAMS', JSON.stringify(params));
        history.push('/withdrawManager/pay');
    }

    render() {
        const columnsMap = [
            ['RealName', '姓名', (text, record) => (<a href='#' onClick={this.jumpToPay.bind(this, record)}>{text}</a>), 100, 'left'],
            ['BillWeeklyBatchId', '批次号', undefined, 100],
            ['BeginDt', '开始时间', tableDateRender, 100],
            ['EndDt', '结束时间', tableDateRender, 100],
            ['EntShortName', '企业'],
            ['TrgtSpShortName', '劳务', undefined, 220],
            ['SrceSpShortName', '中介', undefined, 220],
            ['IdCardNum', '身份证号码', undefined, 150],
            ['EmploymentTyp', '用工模式', (text) => ({ 1: '劳务用工', 2: '灵活用工爱员工' }[text]), 150],
            ['WorkCardNo', '工号'],
            ['EntryDt', '入职时间', tableDateRender, 100],
            ['WorkSts', '在职状态', tableWorkStateRender],
            ['LeaveDt', '离职/转正/自离日期', tableDateRender, 150],
            ['PreCheckInfo', '预检测结果', undefined, 180],
            ['ClockDays', '打卡天数', undefined, 80],
            ['ClockAmt', '打卡周薪(元)', tableMoneyRender, 100],
            ['CreditSubsidyAmt', '信用补贴总金额(元)', tableMoneyRender, 150],
            ['LaborConfirmedAmt', '劳务确认金额(元)', tableMoneyRender],
            ['AdvancePayAmt', '应发周薪(元)', tableMoneyRender, 100],
            ['AgentAmt', '服务费(元)', tableMoneyRender, 80],
            ['PlatformSrvcAmt', '平台费(元)', tableMoneyRender, 80],
            ['AuditSts', '审核状态', tableBillAuditRender, 80],
            ['Remark', '备注'],
            ['AuditDt', '账单审核日期', tableDateRender, 100],
            ['BillSrce', '录入类型', tableSrcRender, 80],
            ['SettlementTyp', '模式', settleTypeRender, 80],
            ['IsAgentAmtForBroker', '是否算绩效', (text) => ({ 1: '是', 2: '否' }[text]), 150],
            ['IntvDate', '面试日期', tableDateRender, 100],
            ['PositiveDate', '预计转正日期', tableDateRender, 100],
            ['JffSpEntName', '工种']
        ];

        const {
            tableInfo: {
                dataList, total, loading
            },
            pagination: {
                current, pageSize
            },
            startQuery,
            setPagination
        } = this.props;

        const [columns, width] = generateColInfo(columnsMap);

        return (
            <div>
                <Table
                    columns={columns}
                    bordered={true}
                    dataSource={dataList.slice()}
                    rowKey='BillWeeklyBatchDetailId'
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
                    loading={loading}
                    refreshData={startQuery} >
                </Table>
            </div>
        );
    }
}

export default ResTable;