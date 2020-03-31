import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Table } from 'antd';
import {
  tableDateRender,
  tableWorkStateRender,
  tableSrcRender,
  tableDateTimeRender,
  tableMoneyRender,
  tableMonthTypeRender
} from 'ADMIN_UTILS/tableItemRender';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';
import { generateColInfo } from 'ADMIN_UTILS';

@observer
class ResTable extends Component {
  render() {
    const columnsMap = [
      ['BillMonthlyBatchId', '批次号', undefined, 100],
      ['BillRelatedMo', '归属月份', undefined, 100],
      ['EntName', '企业'],
      ['TrgtSpName', '劳务', undefined, 220],
      ['SrceSpName', '中介', undefined, 220],
      ['IdCardNum', '身份证号码', undefined, 150],
      ['RealName', '姓名', undefined, 100],
      ['WorkCardNo', '工号'],
      ['EntryDt', '入职时间', tableDateRender, 100],
      ['WorkSts', '在职状态', tableWorkStateRender, 80],
      ['LeaveDt', '离职/转正日期', tableDateRender, 150],
      ['ExcelTrgtSpMonthlyPaidSalary', 'excel实发', tableMoneyRender, 100],
      ['TrgtSpMonthlyPaidSalary', '实发工资(元)', tableMoneyRender, 100],
      ['WeeklyPaidAmt', '已支生活费(元)', tableMoneyRender, 140],
      ['RemainingSalary', '实际剩余工资(元)', tableMoneyRender, 160],
      ['RemainingAgentAmt', '中介费(元)', tableMoneyRender, 100],
      ['SalaryTyp', '月薪类型', tableMonthTypeRender, 100],
      ['PreCheckInfo', '预检测结果', undefined, 180],
      ['IsJoin', '加入对账单', text => ({ 1: '加入', 2: '不加入' }[text]), 100],
      ['Remark', '备注'],
      ['UpdatedName', '操作人', undefined, 100],
      ['UpdatedTm', '操作时间', tableDateTimeRender, 150],
      ['IntvDate', '面试日期', tableDateRender, 100],
      ['PositiveDate', '预计转正日期', tableDateRender, 100],
      ['JffSpEntName', '工种', undefined, 100],
      ['LaborPrice', '单价', tableMoneyRender, 100],
      ['SettlementTyp', '结算模式', undefined, 100],
      ['SystemPrice', '系统工价', undefined, 100],
      [('BillSrce', '录入类型', tableSrcRender, 80)]
    ];

    const [columns, width] = generateColInfo(columnsMap);

    const {
      view: {
        tableInfo: { dataList, total, loading },
        pagination: { current, pageSize }
      },
      setPagination
    } = this.props.monthlyWageImportRecordStore;

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
