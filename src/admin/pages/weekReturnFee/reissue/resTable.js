import React, { Component } from 'react';
import { Table, Button, Row, Col } from 'antd';
import { tableDateRender, tableWorkStateRender, tableMoneyRender } from 'ADMIN_UTILS/tableItemRender';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';
import InfoModal from './infoModal';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import { generateColInfo } from 'ADMIN_UTILS';

class ResTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            infoModalIsShow: false,
            recordInfo: null
        };
    }

    startAdd = () => {
        this.setState({
            infoModalIsShow: true
        });
    }

    hideModal = () => {
        this.setState({
            infoModalIsShow: false,
            recordInfo: null
        });
    }

    startEdit = (e) => {
        const recordID = e.target.dataset.recordid * 1;
        const { tableInfo: { dataList } } = this.props;

        let recordInfo = dataList.find((value) => {
            return value.RecordID == recordID;
        });
        window._czc.push(['_trackEvent', '补发返费周薪', '修改', '补发返费周薪_N非结算']);
        this.setState({
            infoModalIsShow: true,
            recordInfo: recordInfo || this.state.recordInfo
        });
    }

    delRecord = (e) => {
        const recordID = e.target.dataset.recordid * 1;
        const { delRecord } = this.props;
        delRecord(recordID);
        window._czc.push(['_trackEvent', '补发返费周薪', '删除', '补发返费周薪_N非结算']);
    }

    render() {
        const { canReissueX } = resId.weekReturnFee.reissue;

        const columnsMap = [
            ['AgentName', '中介'],
            ['UserName', '姓名'],
            ['IDCardNum', '身份证号码', undefined, 160],
            ['EmployeeNo', '工号'],
            ['UserAmountBeforeTax', '税前周薪(元)', tableMoneyRender],
            ['TaxRate', '税率'],
            ['UserAmount', '税后周薪(元)', tableMoneyRender, 100],
            ['TaxAmount', '扣税金额(元)', tableMoneyRender, 100],
            ['AgentAmount', '服务费(元)'],
            ['EntryDate', '入职日期', tableDateRender],
            ['WorkState', '是否在职', tableWorkStateRender],
            ['LeaveDate', '离职/转正/自离日期', tableDateRender, 180],
            ['Remark', '备注'],
            ['PreCheckInfo', '预检测结果', undefined, 180],
            ['Join', '加入对账单', (text) => ({ 1: '是', 2: '否' }[text])],
            ['Operate', '操作', (text, record) => {
                return (
                    <div>
                        {authority(canReissueX)(<a href='javascript:;' data-recordid={record.RecordID} onClick={this.startEdit}>修改</a>)}
                        <span className='ml-8 mr-8'>|</span>
                        {authority(canReissueX)(<a href='javascript:;' data-recordid={record.RecordID} onClick={this.delRecord}>删除</a>)}
                    </div>
                );
            }]
        ];

        const {
            searchValue,
            tableInfo: {
                dataList,
                loading
            },
            tableVisible,
            commitData,
            editRecord,
            resetOldTable,
            getLaborText,
            getCompanyText
        } = this.props;

        const {
            SettleBeginDate,
            SettleEndDate,
            EnterpriseID,
            LaborID
        } = searchValue;

        const [columns, width] = generateColInfo(columnsMap);

        return tableVisible &&
            <div>
                <Row className='mb-16'>
                    <Col span={12}>
                        {authority(canReissueX)(<Button type='primary' onClick={this.startAdd}>添加</Button>)}
                    </Col>
                    <Col span={12} className='text-right'>
                        {authority(canReissueX)(<Button type='primary' onClick={resetOldTable}>删除表格</Button>)}
                        {authority(canReissueX)(<Button type='primary' className='ml-8' onClick={commitData}>提交</Button>)}
                    </Col>
                </Row>

                <p>发薪周期：{SettleBeginDate.format('YYYY-MM-DD')}至{SettleEndDate.format('YYYY-MM-DD')}&nbsp;企业：{getCompanyText(EnterpriseID)}&nbsp;劳务：{getLaborText(LaborID)}&nbsp;</p>

                <Table
                    columns={columns}
                    bordered={true}
                    rowKey='RecordID'
                    dataSource={dataList.slice()}
                    scroll={{ x: width, y: 550 }}
                    pagination={{
                        ...tablePageDefaultOpt
                    }}
                    loading={loading} >
                </Table>

                {
                    this.state.infoModalIsShow
                        ? <InfoModal
                            {...searchValue}
                            recordInfo={this.state.recordInfo}
                            editRecord={editRecord}
                            hideModal={this.hideModal} />
                        : null
                }
            </div>;

    }
}

export default ResTable;