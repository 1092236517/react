import React, { Component } from 'react';
import { Table, Button, Select, message, Modal, Spin } from 'antd';
import { observer } from 'mobx-react';
import { tableDateRender, tableYesNoRender, tableMonthTypeRender, tableMoneyRender, settleTypeRender } from 'ADMIN_UTILS/tableItemRender';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';
import { safeDiv } from 'ADMIN_UTILS/math';
import 'ADMIN_ASSETS/less/pages/payrollImport.less';
const { Option } = Select;

@observer
class ResTable extends Component {
  state = {
    excelData: [],
    record: '',
    modalLoading: false
  };

  generateColInfo = columnsMap => {
    let allWidth = 0;
    return [
      columnsMap.map(aColumn => {
        const [dataIndex, title, render = null, width = 130, filteredValue = null, onFilter = null, align = 'center'] = aColumn;
        allWidth += width;
        return { dataIndex, title, render, filteredValue, onFilter, align, width };
      }),
      allWidth
    ];
  };

  setDetails = record => {
    this.setState({ modalLoading: false });
    this.setState({ record });
    this.setVisible(true);
    this.setState({ modalLoading: true });
  };
  setVisible = flag => {
    this.setState({ DetailsVisible: flag });
  };
  render() {
    const {
      view: {
        tableInfo: { loading, dataListShow },
        tableVisible,
        recoreMsg
      }
    } = this.props.returnApplicationStore;

    const { excelData } = this.state;

    const columnsMap = [
      ['EnterpriseName', '身份证号码'],
      ['LaborName', '面试日期', undefined, 220],
      ['AgentName', '入职时间', undefined, 220],
      ['UserName', '返费结束日期', undefined, 100],
      ['IDCardNum', '返费金额', undefined, 150]
    ];

    const [columns, width] = this.generateColInfo(columnsMap);

    return (
      tableVisible && (
        <div>
          {recoreMsg}
           {/* <Table*/}
           {/* columns={columns}*/}
           {/* bordered={true}*/}
           {/* scroll={{ x: width + 62, y: 550 }}*/}
           {/* dataSource={dataListShow.slice()}*/}
           {/* rowKey='Number'*/}
           {/* pagination={{*/}
           {/*   ...tablePageDefaultOpt*/}
           {/* }}*/}
           {/* loading={loading}></Table>*/}
        </div>
      )
    );
  }
}

export default ResTable;
