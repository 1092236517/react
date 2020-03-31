import React, { Component } from 'react';
import { observer } from "mobx-react";
import { Table, message, Modal, Input } from 'antd';
import { tableDateRender, tableDateMonthRender, tableSrcRender, tableDateTimeRender, settleTypeRender } from 'ADMIN_UTILS/tableItemRender';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';
import { convertCentToThousandth } from 'web-react-base-utils';
import { setToMoneyFail } from 'ADMIN_SERVICE/ZXX_WithdrawMgr';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import 'ADMIN_ASSETS/less/pages/cover-antd.less';
import { generateColInfo } from 'ADMIN_UTILS';
const { TextArea } = Input;
@observer
class ResTable extends Component {
    state = {
        visible: false,
        Remark: '',
        detailID: null
    };

    setMoneyFail = (detailID) => {
        this.setState({
            detailID: detailID,
            visible: true
        });
        window._czc.push(['_trackEvent', '发薪', '到账成功', '发薪_Y结算']);
    }


    handleRemark = (e) => {
        this.setState({
            Remark: e.target.value
        });
    }

    handleOk = () => {
        if (this.state.Remark !== '') {
            setToMoneyFail({
                WithdrawDetailID: this.state.detailID,
                Remark: this.state.Remark
            }).then((resData) => {
                window._czc.push(['_trackEvent', '发薪', '到账失败', '发薪_Y结算']);
                message.success('设置成功！');
                this.props.startQuery();
                this.setState({
                    visible: false,
                    Remark: '',
                    detailID: null
                });
            }).catch((err) => {
                message.error(err.message);
                console.log(err);
            });
        } else {
            Modal.warn({
                content: (
                    <p>备注必填</p>
                )
            });
        }
    };

    handleCancel = () => {
        this.setState({
            visible: false,
            Remark: '',
            detailID: null
        });
    }

    render() {
        const { setMoneyFailX } = resId.withdrawManager.pay;

        const columnsMap = [
            ['BankAccountName', '姓名', undefined, 100, 'left'],
            ['BatchID', '关联批次号', undefined, 100],
            ['SettleBeginDate', '开始时间', tableDateRender, 100],
            ['SettleEndDate', '结束时间', tableDateRender, 100],
            ['Month', '归属月份', tableDateMonthRender, 100],
            ['IDCardNum', '身份证号码', undefined, 150],
            ['EmploymentTyp', '用工模式', (text, record) => (record.TradeType !== 3 ? (text === 1 ? '劳务用工' : text === 2 ? '灵活用工爱员工' : '') : ''), 150],
            ['BankName', '银行名称'],
            ['EntShortName', '企业名称'],
            ['TrgtSpShortName', '劳务名称', undefined, 220],
            ['BankCardNo', '银行卡号', undefined, 180],
            ['WithdrawTime', '打款时间', tableDateTimeRender, 150],
            ['Amount', '打款金额(元)', convertCentToThousandth, 100],
            ['WithdrawRemark', '款项说明', undefined, 200],
            ['TradeType', '打款类型', (text) => ({ 1: '周薪', 2: '月薪', 4: '周薪重发', 5: '月薪重发', 7: '返费', 8: '返费重发', 9: '周返费', 10: '周返费重发' }[text]), 80],
            ['BatchSrc', '来源', tableSrcRender, 80],
            ['AuditState', '授权状态', (text) => ({ 1: '待审核', 2: '通过', 3: '未通过' }[text]), 80],
            ['AuditUserName', '授权人', undefined, 100],
            ['AuditTime', '授权时间', tableDateTimeRender, 150],
            ['AuditRemark', '授权备注'],
            ['WithdrawState', '打款状态', (text) => ({ 1: '未打款', 2: '打款中', 3: '已打款', 4: '打款失败', 10: '劳务打款' }[text]), 80],
            ['CommitResult', '提交结果', undefined, 150],
            ['ToState', '到账状态', (text, record) => {
                if (text == '2') {
                    return authority(setMoneyFailX)(<a href='javascript:;' onClick={this.setMoneyFail.bind(this, record.WithdrawDetailID)}>到账成功</a>);
                }
                return { 1: '未到账', 2: '到账成功', 3: '到账失败' }[text];
            }, 80],
            ['ToTime', '到账结果时间', tableDateTimeRender, 150],
            ['ToRemark', '到账说明'],
            ['BankOrderID', '银行流水号'],
            ['OPUserName', '操作人', undefined, 100],
            ['SettlementTyp', '结算模式', settleTypeRender, 100]
        ];

        const {
            tableInfo: {
                dataList, total, loading, selectedRowKeys
            },
            pagination: {
                current, pageSize
            },
            setPagination,
            setSelectRowKeys
        } = this.props;

        const [columns, width] = generateColInfo(columnsMap);

        return (
            <div>
                <Table
                    columns={columns}
                    bordered={true}
                    dataSource={dataList.slice()}
                    rowKey='WithdrawDetailID'
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
                        },
                        getCheckboxProps: (record) => ({ disabled: !(record.WithdrawState == 1 && record.AuditState == 2) || record.SalaryPayer == 2 })
                    }}
                    loading={loading} >
                </Table>

                <div>
                    <Modal title="修改到账状态"
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        okText='到账失败'
                        maskClosable={true}
                    >
                        <TextArea onChange={this.handleRemark} value={this.state.Remark} style={{ "display": "inline", "width": "95%" }} rows={1} placeholder='备注必填' />
                    </Modal>
                </div>

            </div>
        );
    }
}

export default ResTable;