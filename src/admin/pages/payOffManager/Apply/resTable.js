import React, { Component, Fragment } from 'react';
import { observer } from "mobx-react";
import { Table, Modal, message } from 'antd';
import { tableSrcRender, tableDateTimeRender } from 'ADMIN_UTILS/tableItemRender';
import { tablePageDefaultOpt } from 'ADMIN_UTILS';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import { generateColInfo } from 'ADMIN_UTILS';
import { convertCentToThousandth } from 'web-react-base-utils';
import { submitAudit } from 'ADMIN_SERVICE/ZXX_Remit';

@observer
class ResTable extends Component {
    submitAudit = (RemittanceAppId) => {
        Modal.confirm({
            content: <h3>确认提交授权？</h3>,
            onOk: () => {
                let reqParam = {
                    RemittanceAppId
                };
                window._czc.push(['_trackEvent', '发薪申请', '提交授权', '发薪申请_Y结算']);
                submitAudit(reqParam).then(() => {
                    message.success('提交成功！');
                    const { startQuery } = this.props;
                    startQuery();
                }).catch((err) => {
                    message.error(err.message);
                    console.log(err);
                });
            }
        });
    }

    render() {
        const { modify: modifyX, delete: deleteX, submitAudit: submitAuditX } = resId.applyList;
        const { editApply, delApply } = this.props;

        const columnsMap = [
            ['BillBatchId', '批次号', undefined, 100],
            ['SettleBeginDt', '开始时间', undefined, 100],
            ['SettleEndDt', '结束时间', undefined, 100],
            ['EntShortName', '企业', undefined, 130],
            ['TrgtSpShortName', '劳务', undefined, 220],
            ['SrceSpShortName', '中介', undefined, 220],
            ['TotCnt', '总人数', undefined, 80],
            ['TotAmt', '会员总金额（元）', convertCentToThousandth, 130],
            ['AgentAmt', '服务费用（元）', convertCentToThousandth, 130],
            ['PlatformSrvcAmt', '平台费用（元）', convertCentToThousandth, 130],
            ['BillBatchTyp', '发薪类别', (text) => ({ 1: '月薪', 2: '周薪', 3: '返费', 4: '周返费' })[text], 80],
            ['BillSrce', '来源', tableSrcRender, 80],
            ['UpdatedByName', '申请人', undefined, 100],
            ['UpdatedTm', '创建时间', tableDateTimeRender, 150],
            ['AuthSubmitSts', '提交授权', (text) => ({ 1: "未提交授权", 2: "已提交授权" }[text]), 120],
            ['AuthSts', '授权状态', (text) => (
                {
                    1: "未授权",
                    2: <span className='color-green'>通过</span>,
                    3: <span className='color-danger'>未通过</span>,
                    4: <span style={{ color: "red" }}>数据异常</span>,
                    5: "余额不足"
                }[text]), 80
            ],
            ['AuthByName', '授权人', undefined, 100],
            ['AuthTm', '授权时间', tableDateTimeRender, 150],
            ['RemittanceAppId', '操作', (text, record) => {
                return (
                    [1, 4, 5].includes(record.AuthSts) &&
                    <div>
                        {
                            record.BillBatchTyp !== 3 &&
                            <Fragment>
                                {authority(modifyX)(<a href='#' onClick={editApply.bind(this, record)}>修改</a>)}
                                {authority(deleteX)(<a href='#' className='ml-8' onClick={delApply.bind(this, record.RemittanceAppId)}>删除</a>)}
                            </Fragment>
                        }
                        {
                            record.AuthSubmitSts == 2 ? <span className='ml-8'>已提交授权</span> : authority(submitAuditX)(<a className='ml-8' onClick={this.submitAudit.bind(this, record.RemittanceAppId)}>提交授权</a>)
                        }
                    </div>
                );
            }, 170, 'right']
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
                    rowKey='RemittanceAppId'
                    scroll={{ x: width + 62, y: 550 }}
                    rowSelection={{
                        selectedRowKeys,
                        onChange: setSelectRowKeys,
                        getCheckboxProps: (record) => ({ disabled: !([1, 4, 5].includes(record.AuthSts) && record.AuthSubmitSts != 2) })
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
                    loading={loading} >
                </Table>
            </div>
        );
    }
}

export default ResTable;