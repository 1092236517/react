import React, { PureComponent } from 'react';
import { Button, message, Modal, Input } from 'antd';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import { auditMemberApply } from 'ADMIN_SERVICE/ZXX_ReturnFeeBill';
import { taxHasToTrgt } from 'ADMIN_SERVICE/ZXX_ReturnFeeBill';

const { TextArea } = Input;
export default class extends PureComponent {
    state = {
        remark: ''
    }
    handleRemark = (e) => {
        this.setState({
            remark: e.target.value
        });
    }
    operData = (AuditSts) => {
        const { selectedRowKeys, selectedRows, reloadData } = this.props;
        this.setState({
            remark: ''
        });
        if (selectedRowKeys.length == 0) {
            message.info('请选择要操作的记录！');
            return;
        }
        const getRecordByID = (id, recordList) => recordList.find((item) => item.ReturnFeeApplyId === id);

        AuditSts !== 4 && Modal.confirm({
            title: AuditSts !== 3 ? '信息' : '请添加作废原因',
            content: AuditSts !== 3 ? `是否确认将返费状态修改【${{ 1: '待审核', 2: '通过', 3: '作废' }[AuditSts]}】` : (
                <TextArea
                    onChange={this.handleRemark}
                    style={{ marginTop: 16 }}
                    rows={3}
                    maxLength={100}
                    placeholder='作废原因' />
            ),
            onOk: () => {
                message.loading('正在操作，请稍后...');
                let recordIndx = 0;
                let resCount = [0, 0];
                const doBatchAudit = () => {
                    const batchID = selectedRowKeys[recordIndx];
                    if (!batchID) {
                        reloadData();
                        message.info(`操作结束。${resCount[0] > 0 ? `成功${resCount[0]}条` : ''}\t${resCount[1] > 0 ? `失败${resCount[1]}条` : ''}`);
                        return;
                    }
                    const { IsSubsidy } = selectedRows[recordIndx];
                    let reqParam = {
                        ReturnFeeApplyId: batchID,
                        AuditSts,
                        IsSubsidy,
                        CancelRemark: AuditSts !== 3 ? '' : this.state.remark
                    };

                    auditMemberApply(reqParam).then(() => {
                        ++recordIndx;
                        resCount[0]++;
                        doBatchAudit();
                    }).catch((err) => {
                        message.error(err.message);
                        console.log(err);
                        ++recordIndx;
                        resCount[1]++;
                        doBatchAudit();
                    });
                };
                doBatchAudit();
                window._czc.push(['_trackEvent', '会员申请表', ['', '待审核', '审核通过', '作废', '税额已发劳务'][AuditSts], '会员申请表_N非结算']);
            }
        });

        // 税额已发劳务
        AuditSts === 4 && Modal.confirm({
            title: '信息',
            content: '是否确认修改税额已发劳务',
            onOk: () => {
                let taxReqParam = {
                    Htyp: 2,
                    ReturnFeeApplyIds: selectedRowKeys
                };
                taxHasToTrgt(taxReqParam).then(() => {
                    message.info('修改成功');
                    reloadData();
                }).catch((err) => {
                    message.error(err.message);
                    console.log(err);
                });
            }
        });
    }
    render() {
        const { auditPassX, destroyX, waitAuditX, taxModefiy, exportX } = resId.returnFee.memberApply;
        const { exportRecord } = this.props;
        return (
            <div className='mb-16'>
                {authority(exportX)(<Button type='primary' className='ml-8' onClick={() => { exportRecord(); window._czc.push(['_trackEvent', '会员申请表', '导出', '会员申请表_N非结算']); }}>导出</Button>)}
                {authority(auditPassX)(<Button type='primary' className='ml-8' onClick={this.operData.bind(this, 2)}>审核通过</Button>)}
                {authority(destroyX)(<Button type='primary' className='ml-8' onClick={this.operData.bind(this, 3)}>作废</Button>)}
                {authority(waitAuditX)(<Button type='primary' className='ml-8' onClick={this.operData.bind(this, 1)}>待审核</Button>)}
                {authority(taxModefiy)(<Button type='primary' className='ml-8' onClick={this.operData.bind(this, 4)}>税额已发劳务</Button>)}
            </div>
        );
    }
} 