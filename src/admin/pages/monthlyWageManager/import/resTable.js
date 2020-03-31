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
    XlsxDownload: null,
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

  exportFormatErrData = () => {
    const { getFormatErrData } = this.props.monthlyWageImportStore;

    if (getFormatErrData.length == 0) {
      return;
    }
    window._czc.push(['_trackEvent', '导入月薪', '导出格式化错误数据', '导入月薪_Y结算']);
    import('./xlsxDownload')
      .then(XlsxDownload => {
        this.setState(
          {
            XlsxDownload: XlsxDownload.default,
            excelData: getFormatErrData
          },
          () => {
            this.setState({
              XlsxDownload: null,
              excelData: []
            });
          }
        );
      })
      .catch(err => {
        message.error(`加载文件错误：${err.message}，请刷新页面后重试。`);
        console.log(err);
      });
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
        tableInfo: { loading, dataListShow, filterInfo },
        tableVisible,
        selectAgentID,
        selectJoinState
      },
      agentList,
      joinBatchCountInAgent,
      totalCountInAgent,
      hanleJoinBatchState,
      switchAgent
    } = this.props.monthlyWageImportStore;

    const { excelData, XlsxDownload } = this.state;

    const columnsMap = [
      ['EnterpriseName', '企业'],
      ['LaborName', '劳务', undefined, 220],
      ['AgentName', '中介', undefined, 220],
      ['UserName', '姓名', undefined, 100],
      ['IDCardNum', '身份证号码', undefined, 150],
      ['EmployeeNo', '工号'],
      ['ExcelAmount', 'excel实发', tableMoneyRender, 100],
      ['Amount', '实发工资(元)', (text, record, index) => (text == '-1' ? '' : tableMoneyRender(text)), 100],
      ['TotalSalary', '应发总工资(元)', tableMoneyRender],
      ['PayedWeekAmout', '已支周薪(元)', tableMoneyRender],
      ['LeftMonthAmout', '剩余月薪(元)', tableMoneyRender],
      ['RemainingAgentAmount', '中介费(元)', tableMoneyRender, 100],
      ['SalaryType', '月薪类型', tableMonthTypeRender, 80],
      ['EntryDate', '入职日期', tableDateRender, 100],
      ['WorkStateOriginText', '在职状态', undefined, 80],
      ['LeaveDate', '离职/转正日期', tableDateRender, 150],
      ['SystemPrice', '系统工价', undefined, 80],
      ['LaborPrice', '单价', tableMoneyRender, 80],
      ['Remark', '备注'],
      ['PreCheckInfo', '预检测结果', undefined, 180],
      [
        'Join',
        '加入对账单',
        tableYesNoRender,
        100,
        (filterInfo && filterInfo.Join) || null,
        (value, record) => {
          return record.Join == value;
        }
      ],
      ['WorkHours', '出勤小时数', value => (value == -1 || value == undefined ? '' : safeDiv(value, 100))],
      ['IntvDate', '面试日期', tableDateRender, 100],
      ['PositiveDate', '预计转正日期', tableDateRender, 100],
      ['JffSpEntName', '工种'],
      ['SettlementTyp', '模式', settleTypeRender, 80],
      [
        'PayrollDetail',
        '工资单详情',
        text => (
          <a className='details' onClick={() => this.setDetails(text)}>
            {text}
          </a>
        ),
        200
      ],
      ['PayrollCheckResult', '工资单预检测结果', value => ['', '正常', '异常'][value], 80]
    ];

    const [columns, width] = this.generateColInfo(columnsMap);

    return (
      tableVisible && (
        <div>
          <div className='mb-16'>
            <Button type='primary' className='mr-8' onClick={this.exportFormatErrData}>
              导出格式化错误数据
            </Button>
            {agentList.map((agent, index) => {
              return (
                <Button
                  key={agent[0]}
                  type={selectAgentID == agent[0] ? 'primary' : 'default'}
                  className={index == 0 ? '' : 'ml-8'}
                  onClick={switchAgent.bind(this, agent[0])}>
                  {agent[1]}
                </Button>
              );
            })}
          </div>

          <div className='mb-16'>
            <label>加入对账单：</label>
            <Select value={selectJoinState} onChange={hanleJoinBatchState} style={{ width: '100px' }}>
              <Option value='0'>全部</Option>
              <Option value='1'>是</Option>
              <Option value='2'>否</Option>
            </Select>
            <span className='ml-16'>
              数据共有{totalCountInAgent}条，加入对账单{joinBatchCountInAgent}条，不加入对账单{totalCountInAgent - joinBatchCountInAgent}条。
            </span>
          </div>

          <Table
            columns={columns}
            bordered={true}
            scroll={{ x: width + 62, y: 550 }}
            dataSource={dataListShow.slice()}
            rowKey='Number'
            pagination={{
              ...tablePageDefaultOpt
            }}
            loading={loading}></Table>

          {XlsxDownload && <XlsxDownload excelData={excelData}></XlsxDownload>}
          <Modal title='详情' onCancel={() => this.setVisible(false)} footer={null} visible={this.state.DetailsVisible}>
            {/* <Spin spinning={this.state.modalLoading}>
                            {this.state.record}
                        </Spin> */}
            {this.state.record}
          </Modal>
        </div>
      )
    );
  }
}

export default ResTable;
