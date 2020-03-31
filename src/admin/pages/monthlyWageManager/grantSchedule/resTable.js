import { generateColInfo, tablePageDefaultOpt } from 'ADMIN_UTILS';
import { tableDateRender, tableDateMonthRender, monthSalaryPayer } from 'ADMIN_UTILS/tableItemRender';
import { Table } from 'antd';
import { observer } from 'mobx-react';
import React, { Component } from 'react';

@observer
class ResTable extends Component {
  render() {
    const columnsMap = [
      ['RelatedMo', '归属月份', tableDateMonthRender, 150],
      ['TrgtSpShortName', '劳务'],
      ['EntShortName', '企业'],
      ['PayDy', '发薪日', undefined, 150],
      ['SettleDuration', '发薪周期', undefined, 100],
      ['MonthSalaryPayer', '月薪是否劳务发放', monthSalaryPayer, 100],
        ['MonthSalaryPaidNum', '月薪已发人数'],
        ['WeekSalaryPaidNum', '周薪已发人数'],
      ['MonthSalarySchedule', '发薪进度', undefined, 100]
    ];

    const [columns, width] = generateColInfo(columnsMap);

    const {
      view: {
        tableInfo: { dataList, total, loading },
        pagination: { current, pageSize }
      },
      setPagination
    } = this.props.grantScheduleStore;

    return (
      <div>
        <Table
          columns={columns}
          bordered={true}
          dataSource={dataList.slice()}
          rowKey={record => record.id}
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
