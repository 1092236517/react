import { GetAgentBillDetailForZProfit } from 'ADMIN_SERVICE/ZXX_Busi_Manage';
import { generateColInfo, tablePageDefaultOpt } from 'ADMIN_UTILS';
import { tableDateRender } from 'ADMIN_UTILS/tableItemRender';
import { message, Modal, Table } from 'antd';
import React, { Component, Fragment } from 'react';

class PaidBIllAmtModal extends Component {
  state = {
      pageSize: 10,
      current: 1,
      total: 0,
      loading: false,
      dataList: []
  }

  componentDidMount() {
      this.startQuery();
  }
  componentWillUnmount() {
      this.setState({
          pageSize: 10,
          current: 1,
          total: 0,
          loading: false
      });
  }

  setStateAsync(state) {
      return new Promise((resolve) => {
          this.setState(state, resolve);
      });
  }

  setPagination = (current, pageSize) => {
      this.setState({
          current, pageSize
      }, () => {
          this.startQuery(); // 分页这里有问题，分页时调用接口的判断 待定
      });
  }

  startQuery = async () => {
      const { EntId, TrgtSpId, RelatedMo } = this.props;
      const { pageSize, current } = this.state;

      let reqParam = {
          EntId,
          TrgtSpId,
          RelatedMo,
          RecordIndex: (current - 1) * pageSize,
          RecordSize: pageSize
      };

      try {
          await this.setStateAsync({ loading: true });
          let resData = await GetAgentBillDetailForZProfit(reqParam) ;
          let { Data: { RecordCount, RecordList } } = resData;
          RecordList = RecordList.map((item, primaryIndex) => {
              return {...item, primaryIndex};
          });
          this.setState({
              dataList: RecordList || [],
              total: RecordCount,
              loading: false
          }, () => {
              console.log(RecordList, this.state.dataList);
          });
      } catch (err) {
          await this.setStateAsync({ loading: false });
          message.error(err.message);
          console.log(err);
      }
  }

  render() {
      const { dataList, loading, pageSize, current, total } = this.state;
      const { closeModal, RelatedMoShow, TrgtSpName, EntShortName } = this.props;
      const columnsMap = [
          ['BillType', '到账记录ID', (text) => ({ 1: '月批次', 2: '周批次' }[text]), 100],
          ['EndDt', '到账录入时间', tableDateRender, 120],
          ['RealName', '到账总金额', undefined, 100],
          ['BillBatchId', '周薪', undefined, 80],
          ['IdCardNum', '月薪', undefined, 150],
          ['AgentDayNum', '中介费', undefined, 80],
          ['BillAuditTm', '平台费', undefined, 150]
      ];

      const [columns, width] = generateColInfo(columnsMap);

      return (
          <Fragment>
              <Modal
                  visible={true}
                  width={'80%'}
                  title={'已到账款'}
                  maskClosable={false}
                  onCancel={closeModal}
                  onOk={closeModal} >
                  <div>
                      <p><span>{RelatedMoShow}</span><span>{TrgtSpName}{EntShortName}</span></p>
                      <Table
                          rowKey={'primaryIndex'}
                          bordered={true}
                          dataSource={dataList.slice()}
                          loading={loading}
                          columns={columns}
                          scroll={{ x: width, y: 550 }}
                          pagination={{
                              ...tablePageDefaultOpt,
                              pageSize,
                              current,
                              total,
                              onChange: (page, pageSize) => {
                                  this.setPagination(page, pageSize);
                              },
                              onShowSizeChange: (current, size) => {
                                  this.setPagination(current, size);
                              }
                          }}>

                      </Table>
                  </div>

              </Modal>
          </Fragment>
      );
  }
}

export default PaidBIllAmtModal;