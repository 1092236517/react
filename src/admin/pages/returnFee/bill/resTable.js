import React, { Component } from 'react';
import { Table, Modal, Row, Col, Input } from 'antd';
import { tableMoneyRender, tableDateRender, tableDateTimeRender, tableDateMonthRender, sendLaborStsRender, settleTypeRender } from 'ADMIN_UTILS/tableItemRender';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';
import { observer } from "mobx-react";
import { generateColInfo } from 'ADMIN_UTILS';
import 'ADMIN_ASSETS/less/pages/payrollImport.less';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
const { TextArea } = Input;
@observer
class ResTable extends Component {
    state = {
        DetailsVisible: false,
        record: '',
        markVisible: '',
        contentOfRemarks: ''
    }
    setDetails = (record) => {
        this.setState({ record });
        this.setVisible(true);
    }
    setVisible = (flag) => {
        this.setState({
            'DetailsVisible': flag
        });
    }
    editMark = (text) => {
        const { selectedRowKeys } = this.props;

        this.setState({
            markVisible: true,
            contentOfRemarks: text
        });
    }
    saveMark = () => {
        const { saveMarkRecord } = this.props;
        window._czc.push(['_trackEvent', '平台返费账单', '保存修改备注', '平台返费账单_N非结算']);
    }
    cancelMark = () => {
        this.setState({
            markVisible: false
        });
    }
    textAreaMarkOpt = ({ target: { value } }) => {
        this.setState({
            contentOfRemarks: value
        });
    };
    render() {
        const { exportX, textAreaMarkOpt, auditNotPassX, hasSendLaborX, refusePayX, successPayX, waitX, unAuditX } = resId.returnFee.bill;
        const columnsMap = [
            ['RealName', '姓名', undefined, 100, true],
            ['IdCardNum', '身份证号码', undefined, 150, true],
            ['EntShortName', '企业', undefined, undefined, true],
            ['TrgtSpShortName', '劳务', undefined, 220, true],
            ['WorkCardNo', '工号', undefined, 100],
            ['IntvDt', '面试日期', tableDateRender, 100],
            ['EntryDt', '入职日期', tableDateRender, 100],
            ['ReturnFeeDays', '返费天数', undefined, 80],
            ['FfEndDt', '返费结束日期', tableDateRender, 100],
            ['ReturnFee', '税后金额', tableMoneyRender, 80],
            ['PlatformSrvcAmt', '平台费', tableMoneyRender, 80],
            ['SettlementTyp', '结算模式', settleTypeRender, 80],
            ['HasReturnFee', '是否劳务打款', (val) => ({ 1: '劳务返费', 2: '平台返费' }[val])],
            ['IsSendSp', '是否已发劳务', (val) => ({ 1: '未发', 2: '已发' }[val])],
            ['AuditSts', '审核状态', (val) => ({ 1: <span style={{ color: '#0099FF' }}>待审核</span>, 2: <span style={{ color: '#00AA00' }}>通过</span>, 3: <span style={{ color: 'red' }}>未通过</span>, 4: <span style={{ color: '#00AA00' }}>等待</span> }[val]), 80],
            ['TransferResult', '付款状态', (val) => ({ 1: <span style={{ color: '#0099FF' }}>未打款</span>, 2: <span style={{ color: '#00AA00' }}>已打款</span>, 3: <span style={{ color: 'red' }}>拒绝打款</span> }[val]), 80],
            ['BankCardNum', '银行卡号', undefined, 180],
            ['BankName', '银行名称'],
            ['AccntBank', '开户行'],
            ['CreatedByName', '操作人', undefined, 100],
            ['AuditByName', '审核人', undefined, 100],
            ['AuditTm', '审核时间', tableDateTimeRender, 150],
            ['ReturnFeeBillId', '批次号'],
            ['BillRelatedMo', '归属月份', tableDateMonthRender, 100],
            ['CreatedTm', '账单生成时间', tableDateTimeRender, 150],
            ['InvalidReason', '作废原因', (text) => <a className="details" onClick={() => this.setDetails(text)}>{text}</a>, 200],
            ['Remark', '备注', undefined, 150]
            // ['Remark', '备注', (text, record) => (authority(exportX)(<a href='javascript:;' onClick={this.textAreaMarkOpt.bind(this, text)}>{text}</a>)), 150]
        ];

        const {
            tableInfo: {
                dataList, loading, total, selectedRowKeys
            },
            pagination: {
                current,
                pageSize
            },
            setPagination,
            setSelectRowKeys
        } = this.props;

        const [columns, width] = generateColInfo(columnsMap);
        const { contentOfRemarks } = this.state;
        return (
            <div>
                <Table
                    columns={columns}
                    bordered={true}
                    dataSource={dataList.slice()}
                    rowKey='ReturnFeeBillId'
                    scroll={{ x: width + 62, y: 550 }}
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
                    rowSelection={{
                        selectedRowKeys: selectedRowKeys,
                        onChange: (selectedRowKeys, selectedRows) => {
                            setSelectRowKeys(selectedRowKeys, selectedRows);
                        }
                    }}
                    loading={loading} >
                </Table>
                <Modal
                    title="详情"
                    onCancel={() => this.setVisible(false)}
                    footer={null}
                    visible={this.state.DetailsVisible}
                >
                    {this.state.record}
                </Modal>

                <Modal
                    title="修改备注"
                    visible={this.state.markVisible}
                    onOk={this.saveMark}
                    onCancel={this.cancelMark}
                >
                    <Row>
                        <Col span={2}> 备注:</Col>
                        <Col span={22}> <TextArea rows={6} value={contentOfRemarks} onChange={this.textAreaMarkOpt} /></Col>
                    </Row>

                </Modal>
            </div>
        );
    }
}

export default ResTable;