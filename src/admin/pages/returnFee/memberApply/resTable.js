import React, { Component } from 'react';
import { Table, Modal, Input, message } from 'antd';
import { tableMoneyRender, tableDateRender, settleTypeRender, tableDateTimeRender } from 'ADMIN_UTILS/tableItemRender';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';
import { observer } from "mobx-react";
import { generateColInfo } from 'ADMIN_UTILS';
import { editDestroyReas } from 'ADMIN_SERVICE/ZXX_ReturnFeeBill';
import 'ADMIN_ASSETS/less/pages/bAccountManager.less';


const { TextArea } = Input;

@observer
class ResTable extends Component {
    state = {
        remark: ''
    }

    handleRemark = (e) => {
        this.setState({
            remark: e.target.value
        });
    }

    editReason = ({ ReturnFeeApplyId, CancelRemark }) => {
        Modal.confirm({
            title: '信息',
            content: (
                <TextArea
                    defaultValue={CancelRemark}
                    onChange={this.handleRemark}
                    style={{ marginTop: 16 }}
                    rows={3}
                    maxLength={100}
                    placeholder='作废备注' />
            ),
            onOk: () => {
                const { remark } = this.state;
                let reqParam = {
                    CancelRemark: remark,
                    ReturnFeeApplyId
                };
                editDestroyReas(reqParam).then(() => {
                    message.success('操作成功！');
                    this.props.reloadData();
                }).catch((err) => {
                    message.error(err.message);
                    console.log(err);
                });
                window._czc.push(['_trackEvent', '会员申请表', '编辑', '会员申请表_N非结算']);
            }
        });
    }
    render() {
        const columnsMap = [
            ['RealName', '姓名', undefined, 100, 'left'],
            ['IdCardNum', '身份证号码', undefined, 150, 'left'],
            ['EntShortName', '企业', undefined, 130, 'left'],
            ['TrgtSpShortName', '劳务', undefined, 220, 'left'],
            ['WorkCardNo', '工号', undefined, 100],
            ['IntvDt', '面试日期', tableDateRender, 100],
            ['EntryDt', '入职日期', tableDateRender, 100],
            ['FfEndDt', '返费结束日期', tableDateRender, 100],
            // ['IsSubsidy', '能否补贴', (val) => ({ 1: '不可补', 2: '可补', 3: '未知' }[val]), 80],
            ['TaxAfter', '税后金额', tableMoneyRender, 80],
            ['SettlementTyp', '结算模式', settleTypeRender, 80],
            ['WorkSts', '在离职状态', (val) => ({ 0: '', 1: '在职', 2: '离职', 3: '转正', 4: '未入职', 5: '未知', 6: '自离' }[val])],
            ['LeaveDt', '离职/转正/自离日期', tableDateRender, 180],
            ['HasReturnFee', '是否劳务打款', (val) => ({ 1: '劳务返费', 2: '平台返费' }[val])],
            ['IsSendSp', '是否已发劳务', (val) => ({ 1: '未发', 2: '已发' }[val])],
            ['AuditSts', '审核状态', (val) => ({ 1: <span style={{ color: '#0099FF' }}>待审核</span>, 2: <span style={{ color: '#00AA00' }}>通过</span>, 3: <span style={{ color: 'red' }}>已作废</span> }[val]), 80],
            ['TransferResult', '付款状态', (val) => ({ 1: <span style={{ color: '#0099FF' }}>未打款</span>, 2: <span style={{ color: '#00AA00' }}>已打款</span>, 3: <span style={{ color: 'red' }}>拒绝打款</span> }[val]), 80],
            ['SrceSpShortName', '中介', undefined, 220],
            ['BankCardNum', '银行卡号', undefined, 180],
            ['BankName', '银行名称'],
            ['AccntBank', '开户行'],
            ['AuditByName', '审核人', undefined, 100],
            ['AuditTm', '审核时间', tableDateTimeRender, 150],
            ['NameListModifyTimes', '名单/订单改变', (val, record) => {
                if (record.IsOrderChangeApplied === 2) {
                    return <span>{val}/{record.OrderListModfiyTimes}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: 'red' }}>异常</span></span>;
                }
                return <span>{val}/{record.OrderListModfiyTimes}</span>;
            }, 120],
            ['ReturnFee', '返费金额', tableMoneyRender, 80],
            ['TaxRate', '税率'],
            ['Tax', '税额', tableMoneyRender, 80],
            ['ApplyDt', '申请日期', tableDateRender, 100],
            ['CancelRemark', '作废原因', (val, record) => {
                if (record.AuditSts === 3) {
                    return <div>{val}&nbsp;<a href='#' onClick={this.editReason.bind(this, record)}>编辑</a></div>;
                }
                return val;
            }],
            ['ReturnFeeIsTax', '返费是否扣税', (val) => ({ 1: '否', 2: '是' }[val])],
            ['TaxToTrgtSts', '税额是否已发劳务', (val) => ({ 0: '', 1: '否', 2: '是' }[val])],
            ['RemainingReturnFee', '剩余返费', tableMoneyRender, 80],
            ['IdealRemainingReturnFee', '理论剩余返费', tableMoneyRender],
            ['PaidReturnFee', '已发返费周薪', tableMoneyRender]
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

        return (
            <div>
                <Table
                    columns={columns}
                    bordered={true}
                    dataSource={dataList.slice()}
                    rowKey='ReturnFeeApplyId'
                    scroll={{ x: width + 62, y: 550 }}
                    rowClassName={record => {
                        if ((record.IsOrderChangeApplied === 2)) {
                            return 'RedRowColor';
                        }
                    }}
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
            </div>
        );
    }
}

export default ResTable;