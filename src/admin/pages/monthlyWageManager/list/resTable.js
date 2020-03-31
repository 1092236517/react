import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Table } from 'antd';
import {
  tableDateRender,
  tableDateMonthRender,
  tableSrcRender,
  tableWorkStateRender,
  tableMoneyRender,
  tableMonthTypeRender,
  tableBillAuditRender,
  settleTypeRender
} from 'ADMIN_UTILS/tableItemRender';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';
import { withRouter } from 'react-router';
import { generateColInfo } from 'ADMIN_UTILS';

@withRouter
@observer
class ResTable extends Component {
  //  跳转至发薪列表
  jumpToPay = record => {
    const { history } = this.props;
    window._czc.push(['_trackEvent', '月薪查询', '跳转发薪页面', '月薪查询_Y结算']);
    let params = {
      BatchID: record.BillMonthlyBatchId,
      RealName: record.RealName,
      TradeType: 2
    };
    //  通过push携带state存在bug，必须发薪tab页存在时才有效，可能是封装的框架组件造成的
    sessionStorage.setItem('TEMP_JUMP_PARAMS', JSON.stringify(params));
    history.push('/withdrawManager/pay');
  };

  render() {
    const columnsMap = [
      [
        'RealName',
        '姓名',
        (text, record) => (
          <a href='#' onClick={this.jumpToPay.bind(this, record)}>
            {text}
          </a>
        ),
        100,
        'left'
      ],
      ['BillMonthlyBatchId', '批次号', undefined, 100],
      ['BillRelatedMo', '归属月份', tableDateMonthRender, 100],
      ['EntName', '企业'],
      ['TrgtSpName', '劳务', undefined, 220],
      ['SrceSpName', '中介', undefined, 220],
      ['IdCardNum', '身份证号码', undefined, 150],
      ['EmploymentTyp', '用工模式', text => ({ 1: '劳务用工', 2: '灵活用工爱员工' }[text]), 150],
      ['WorkCardNo', '工号'],
      ['EntryDt', '入职时间', tableDateRender, 100],
      ['WorkSts', '在职状态', tableWorkStateRender, 80],
      ['LeaveDt', '离职/转正日期', tableDateRender, 150],
      ['PreCheckInfo', '预检测结果', undefined, 180],
      ['ExcelTrgtSpMonthlyPaidSalary', 'excel实发', tableMoneyRender, 100],
      ['TrgtSpMonthlyPaidSalary', '实发工资(元)', tableMoneyRender, 100],
      ['TotSalary', '应发总工资(元)', (text, record) => (record.SalaryTyp == 6 ? '/' : tableMoneyRender(text))],
      ['WeeklyPaidAmt', '已支生活费(元)', (text, record) => (record.SalaryTyp == 6 ? '/' : tableMoneyRender(text))],
      ['MonthlyPaidAmt', '已发工资(元)', (text, record) => (record.SalaryTyp == 6 ? '/' : tableMoneyRender(text))],
      ['IdealRemainingSalary', '理论剩余工资(元)', (text, record) => (record.SalaryTyp == 6 ? '/' : tableMoneyRender(text))],
      ['RemainingSalary', '实际剩余工资(元)', tableMoneyRender],
      ['SalaryTyp', '月薪类型', tableMonthTypeRender, 80],
      ['PlatformSrvcAmt', '平台费(元)', tableMoneyRender, 100],
      ['RemainingAgentAmt', '服务费(元)', tableMoneyRender, 100],
      ['TrgtSpAuditSts', '审核状态', tableBillAuditRender, 80],
      ['Remark', '备注'],
      ['AuditDt', '账单审核日期', undefined, 100],
      ['BillSrce', '录入类型', tableSrcRender, 80],
      ['SettlementTyp', '模式', settleTypeRender, 80],
      ['MonthSalaryPayer', '是否劳务发放', text => ({ 2: '是', 1: '否' }[text])],
      ['IntvDate', '面试日期', tableDateRender, 100],
      ['PositiveDate', '预计转正日期', tableDateRender, 100],
      ['JffSpEntName', '工种']
    ];

    const {
      tableInfo: { dataList, total, loading },
      pagination: { current, pageSize },
      setPagination
    } = this.props;

    const [columns, width] = generateColInfo(columnsMap);

    return (
      <div>
        <Table
          columns={columns}
          bordered={true}
          dataSource={dataList.slice()}
          rowKey='BillMonthlyBatchDetailId'
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
          loading={loading}></Table>
      </div>
    );
  }
}

export default ResTable;
