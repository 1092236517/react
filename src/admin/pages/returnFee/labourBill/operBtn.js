import React, { PureComponent } from 'react';
import { Button, message, Modal, Input, Row, Col } from 'antd';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import { auditBill, editBillTransferSts, editBillHasSendLabor } from 'ADMIN_SERVICE/ZXX_ReturnFeeBill';

export default class extends PureComponent {
    state = {
        messageStr: '',
        visible: false,
        statusVisible: false,
        statusMessageStr: '',
        type: '',
        sts: '',
        description: '',
        markVisible: false,
        contentOfRemarks: ''
    }
    operData = (type, sts) => {
        const { selectedRowKeys, selectedRows, reloadData } = this.props;
        if (selectedRowKeys.length == 0) {
            message.info('请选择要操作的记录！');
            return;
        }
        this.setState({
            description: ''
        });
        const callFunc = { audit: auditBill, pay: editBillTransferSts, labor: editBillHasSendLabor }[type];
        const messageMap = {
            audit: {
                2: '审核通过', 3: '审核不通过'
            },
            pay: {
                2: '付款成功', 3: '拒绝付款'
            },
            labor: '已发劳务'
        };
        const messageStr = type == 'labor' ? messageMap['labor'] : messageMap[type][sts];
        this.setState({
            'messageStr': messageStr,
            visible: true,
            type: type,
            sts: sts
        });
        window._czc.push(['_trackEvent', '返费账单', messageStr, '返费账单_N非结算']);
    }
    buttonOnOk = () => {
        const { selectedRowKeys, selectedRows, reloadData } = this.props;
        const { type, sts, description } = this.state;
        const callFunc = { audit: auditBill, pay: editBillTransferSts, labor: editBillHasSendLabor }[type];
        const getRecordByID = (id, recordList) => recordList.find((item) => item.ReturnFeeBillId === id);
        message.loading('正在操作，请稍后...');
        let recordIndx = 0;
        let resCount = [0, 0];
        const doBatch = () => {
            const batchID = selectedRowKeys[recordIndx];
            if (!batchID) {
                this.setState({
                    visible: false
                });
                reloadData();
                message.info(`操作结束。${resCount[0] > 0 ? `成功${resCount[0]}条` : ''}\t${resCount[1] > 0 ? `失败${resCount[1]}条` : ''}`);
                return;
            }

            let reqParam = {
                ReturnFeeBillId: batchID
            };

            //  审核
            if (type == 'audit') {
                reqParam.AuditSts = sts;
                if (sts === 3) {
                    reqParam.InvalidReason = description;
                    if (selectedRows.length > 1 && description !== '') {
                        message.error('填写原因时只能选择一条数据');
                        return;
                    }
                }
            }

            //  付款
            if (type == 'pay') {
                const { HasReturnFee, AuditSts } = getRecordByID(batchID, selectedRows);
                reqParam = {
                    ...reqParam,
                    AuditSts,
                    HasReturnFee,
                    TransferResult: sts
                };
            }

            //  劳务
            if (type == 'labor') {
                const { HasReturnFee } = getRecordByID(batchID, selectedRows);
                reqParam.HasReturnFee = HasReturnFee;
            }

            callFunc(reqParam).then(() => {
                ++recordIndx;

                resCount[0]++;
                doBatch();
                this.setState({
                    visible: false
                });
            }).catch((err) => {
                message.error(err.message);
                console.log(err);
                ++recordIndx;
                resCount[1]++;
                doBatch();
            });
        };
        doBatch();
    }
    handleCancel = e => {
        this.setState({
            visible: false
        });
    };
    auditBillOpt = (type) => {
        let { selectedRows } = this.props;
        selectedRows = selectedRows || [];
        if (selectedRows.length == 0) {
            message.info('请选择要操作的记录！');
            return;
        }
        let flag = false;
        selectedRows.forEach((item, index) => {
            if (type === 1) {
                if (item.AuditSts !== 4) {
                    message.info('只能选择状态为等待的数据');
                    flag = true;
                    return false;
                }
            } else {
                if (item.AuditSts !== 1) {
                    message.info('只能选择状态为待审核的数据');
                    flag = true;
                    return false;
                }
            }
        });
        if (flag === false) {
            this.setState({
                'statusMessageStr': type === 1 ? '待审核' : '等待',
                statusVisible: true,
                optType: type
            });
        }
        window._czc.push(['_trackEvent', '返费账单', type === 1 ? '待审核' : '等待', '返费账单_N非结算']);
    }
    statusButtonOnOk = () => {
        const { auditBillOpt } = this.props;
        const { optType } = this.state;
        auditBillOpt(optType);
        this.setState({
            statusVisible: false
        });
        window._czc.push(['_trackEvent', '返费账单', '修改状态', '返费账单_N非结算']);
    }
    statusHandleCancel = e => {
        this.setState({
            statusVisible: false
        });
    };
    textAreaOpt = ({ target: { value } }) => {
        this.setState({
            description: value
        });
    };

    addMark = () => {
        const { selectedRowKeys } = this.props;
        if (selectedRowKeys.length == 0) {
            message.info('请选择要操作的记录！');
            return;
        }
        this.setState({
            markVisible: true,
            contentOfRemarks: ''
        });
        window._czc.push(['_trackEvent', '返费账单', '点击添加备注', '返费账单_N非结算']);
    }
    saveMark = () => {
        const { saveMarkRecord, selectedRowKeys, reloadData } = this.props;
        let { contentOfRemarks } = this.state;
        let params = {
            IdList: selectedRowKeys,
            Remark: contentOfRemarks
        };
        let { Code } = saveMarkRecord(params);
        this.setState({
            markVisible: false
        });
        reloadData();
        window._czc.push(['_trackEvent', '返费账单', '保存备注', '返费账单_N非结算']);
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
        const { exportX, auditPassX, auditNotPassX, hasSendLaborX, refusePayX, successPayX, waitX, unAuditX } = resId.returnFee.labourBill;
        const { exportRecord } = this.props;
        const { TextArea } = Input;
        let { type, sts, description, contentOfRemarks } = this.state;
        return (
            <div className='mb-16'>
                {authority(exportX)(<Button type='primary' onClick={() => { exportRecord(); window._czc.push(['_trackEvent', '返费账单', '保存添加备注', '返费账单_N非结算']); }}>导出</Button>)}
                {authority(auditPassX)(<Button type='primary' className='ml-8' onClick={this.operData.bind(this, 'audit', 2)}>审核通过</Button>)}
                {authority(auditNotPassX)(<Button type='primary' className='ml-8' onClick={this.operData.bind(this, 'audit', 3)}>审核不通过</Button>)}
                {authority(hasSendLaborX)(<Button type='primary' className='ml-8' onClick={this.operData.bind(this, 'labor')}>已发劳务</Button>)}
                {authority(refusePayX)(<Button type='primary' className='ml-8' onClick={this.operData.bind(this, 'pay', 3)}>拒绝付款</Button>)}
                {authority(successPayX)(<Button type='primary' className='ml-8' onClick={this.operData.bind(this, 'pay', 2)}>付款成功</Button>)}
                {authority(waitX)(<Button type='primary' className='ml-8' onClick={this.auditBillOpt.bind(this, 4)}>等待</Button>)}
                {authority(unAuditX)(<Button type='primary' className='ml-8' onClick={this.auditBillOpt.bind(this, 1)}>未审核</Button>)}
                {authority(unAuditX)(<Button type='primary' className='ml-8' onClick={this.addMark.bind(this)}>添加备注</Button>)}
                <Modal
                    title="信息"
                    visible={this.state.visible}
                    onOk={this.buttonOnOk}
                    onCancel={this.handleCancel}
                >
                    {`是否将状态修改为【${this.state.messageStr}】?`}
                    <br /> <br />
                    {type === 'audit' && sts === 3 && <Row>
                        <Col span={2}> 原因:</Col>
                        <Col span={22}> <TextArea rows={6} value={description} onChange={this.textAreaOpt} /></Col>
                    </Row>}

                </Modal>
                <Modal
                    title="状态"
                    visible={this.state.statusVisible}
                    onOk={this.statusButtonOnOk}
                    onCancel={this.statusHandleCancel}
                >
                    {`是否将状态修改为【${this.state.statusMessageStr}】?`}
                </Modal>
                <Modal
                    title="添加备注"
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