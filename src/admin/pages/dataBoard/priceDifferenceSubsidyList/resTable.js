import { generateColInfo, tablePageDefaultOpt } from 'ADMIN_UTILS';
import { tableDateRender, tableMoneyRender } from 'ADMIN_UTILS/tableItemRender';
import { Table } from 'antd';
import { observer } from 'mobx-react';
import React, { Component } from 'react';

@observer
class ResTable extends Component {
  render() {
    const columnsMap = [
      ['RcrtOrderId', '订单ID', undefined, 100],
      ['SpShortName', '劳务', undefined, 220],
      ['EntShortName', '企业'],
        ['RealName', '姓名'],
        ['WorkCardNo', '工号'],
        ['IdCardNum', '身份证'],
        ['WorkSts', '在职状态', value => ({ 1: '在职', 2: '离职', 3: '转正', 4: '未入职', 5: '未知', 6: '自离' }[value]), 100],
        ['IntvDt', '面试日期'],
        ['EntryDt', '入职日期'],
        ['LeaveDt', '离职日期'],
      ['BeginDt', '订单开始日期', tableDateRender, 150],
      ['EndDt', '订单结束日期', tableDateRender, 150],
      ['JffSpEntName', '工种', undefined, 50],
      [
        'SettlementTyp',
        '结算类型',
        value => ({ 1: 'ZX结算方式', 2: 'Z结算方式', 3: 'ZA结算方式', 4: 'Z-B结算方式', 5: 'ZX-B结算方式', 6: 'ZX-A结算方式' }[value]),
        100
      ],
      ['DiffPriceIssueDt', '差价补发日', undefined, 150],
      ['EnjoyStart', '享受周期开始时间', tableDateRender, 150],
      ['EnjoyEnd', '享受周期结束时间', tableDateRender, 150],
      ['InWorkDay', '满足获得补贴的在职时间', undefined, 100],
      ['SubsidyMoney', '补贴金额(元/小时)', tableMoneyRender, 100],
      ['IssueDay', '发放日期', tableDateRender, 150]
    ];

    const [columns, width] = generateColInfo(columnsMap);

    const {
      view: {
        tableInfo: { dataList, total, loading },
        pagination: { current, pageSize }
      },
      setPagination
    } = this.props.priceDifferenceSubsidyListStore;

    return (
      <div>
        <Table
          columns={columns}
          bordered={true}
          dataSource={dataList.slice()}
          rowKey='NameListId'
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
