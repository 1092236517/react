import React, { Component } from 'react';
import { Table, Button, Row, Col } from 'antd';
import { tableDateRender, tableWorkStateRender, tableMoneyRender } from 'ADMIN_UTILS/tableItemRender';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';
import { observer } from "mobx-react";
import InfoModal from './infoModal';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import { generateColInfo } from 'ADMIN_UTILS';

@observer
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
        window._czc.push(['_trackEvent', '周薪补发', '点击添加按钮', '周薪补发_Y结算']);
    }

    hideModal = () => {
        this.setState({
            infoModalIsShow: false,
            recordInfo: null
        });
    }

    startEdit = (e) => {
        const recordID = e.target.dataset.recordid * 1;
        const { view: { tableInfo: { dataList } } } = this.props.weeklyWageReissueStore;

        let recordInfo = dataList.find((value) => {
            return value.RecordID == recordID;
        });
        window._czc.push(['_trackEvent', '周薪补发', '修改', '周薪补发_Y结算']);
        this.setState({
            infoModalIsShow: true,
            recordInfo: recordInfo || this.state.recordInfo
        });
    }

    delRecord = (e) => {
        const recordID = e.target.dataset.recordid * 1;
        const { delRecord } = this.props.weeklyWageReissueStore;
        delRecord(recordID);
        window._czc.push(['_trackEvent', '周薪补发', '删除', '周薪补发_Y结算']);
    }

    render() {
        const { addTableDataX, resetOldTableX, commitDataX, editTableDataX, deleteTableDataX } = resId.weeklyWageManager.reissue;

        const columnsMap = [
            ['AgentName', '中介'],
            ['UserName', '姓名'],
            ['IDCardNum', '身份证号码', undefined, 160],
            ['EmployeeNo', '工号'],
            ['BaseAmount', '补发周薪(元)'],
            ['CreditSubsidyAmt', '信用金额(元)'],
            ['Amount', '劳务确认金额(元)'],
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
                        {authority(editTableDataX)(<a href='javascript:;' data-recordid={record.RecordID} onClick={this.startEdit}>修改</a>)}
                        <span className='ml-8 mr-8'>|</span>
                        {authority(deleteTableDataX)(<a href='javascript:;' data-recordid={record.RecordID} onClick={this.delRecord}>删除</a>)}
                    </div>
                );
            }]
        ];

        const {
            view: {
                searchValue: {
                    SettleBeginDate,
                    SettleEndDate,
                    EnterpriseID,
                    LaborID
                },
                tableInfo: {
                    dataList,
                    loading,
                    UserAmount,
                    PlatformAmount,
                    AgentAmount,
                    UserAmountNum
                },
                tableVisible
            },
            commitData,
            editRecord,
            resetOldTable
        } = this.props.weeklyWageReissueStore;

        const { view: { searchValue } } = this.props.weeklyWageReissueStore;

        const { getLaborText, getCompanyText } = this.props.globalStore;

        const [columns, width] = generateColInfo(columnsMap);

        return !tableVisible
            ? null
            : (<div>
                <Row className='mb-16'>
                    <Col span={12}>
                        {authority(addTableDataX)(<Button type='primary' onClick={this.startAdd}>添加</Button>)}
                    </Col>
                    <Col span={12} className='text-right'>
                        {authority(resetOldTableX)(<Button type='primary' onClick={() => { resetOldTable(); window._czc.push(['_trackEvent', '周薪补发', '点击删除表格按钮', '周薪补发_Y结算']); }}>删除表格</Button>)}
                        {authority(commitDataX)(<Button type='primary' className='ml-8' onClick={() => { commitData(); window._czc.push(['_trackEvent', '周薪补发', '点击提交按钮', '周薪补发_Y结算']); }}>提交</Button>)}
                    </Col>
                </Row>

                <p>发薪周期：{SettleBeginDate.format('YYYY-MM-DD')}至{SettleEndDate.format('YYYY-MM-DD')}&nbsp;企业：{getCompanyText(EnterpriseID)}&nbsp;劳务：{getLaborText(LaborID)}&nbsp;</p>
                <p>总人次{dataList.length}&nbsp;&nbsp;周薪发放人次{UserAmountNum || 0}&nbsp;&nbsp;总周薪{UserAmount || 0}元&nbsp;&nbsp;总服务费{AgentAmount || 0}元&nbsp;&nbsp;总平台费{PlatformAmount || 0}元&nbsp;</p>

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
            </div>);

    }
}

export default ResTable;
