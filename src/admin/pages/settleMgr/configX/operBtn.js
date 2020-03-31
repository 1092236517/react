import React, { PureComponent } from 'react';
import { Button, message, Modal, Input } from 'antd';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import { auditConfigX } from 'ADMIN_SERVICE/ZXX_XManager';

const { TextArea } = Input;

export default class extends PureComponent {
    state = {
        remark: ''
    }

    addConfig = () => {
        const { showModal } = this.props;
        showModal();
        window._czc.push(['_trackEvent', 'X项配置', '点击新增按钮', 'X项配置_Y结算']);
    }

    handleRemark = (e) => {
        this.setState({
            remark: e.target.value
        });
    }

    audit = (sts) => {
        const { selectedRowKeys, reloadData } = this.props;
        if (selectedRowKeys.length == 0) {
            message.info('请选择要操作的记录！');
            return;
        }

        Modal.confirm({
            title: '信息',
            content: (
                <TextArea onChange={this.handleRemark} style={{ marginTop: 16 }} rows={3} maxLength={100} placeholder='审核备注' />
            ),
            onOk: () => {

                window._czc.push(['_trackEvent', 'X项配置', sts == 2 ? '审核通过' : '审核不通过', 'X项配置_Y结算']);
                const { remark } = this.state;
                let reqParam = {
                    XConfigureID: selectedRowKeys,
                    AuditRemark: remark,
                    AuditSts: sts
                };
                auditConfigX(reqParam).then((resData) => {
                    message.success('审核成功！');
                    reloadData();
                }).catch((err) => {
                    message.error(err.message);
                    console.log(err);
                });
            }
        });
    }

    render() {
        const { addConfigX, auditPassX, auditNotPassX } = resId.settleMgr.configX;
        return (
            <div className='mb-16'>
                {authority(addConfigX)(<Button type='primary' onClick={this.addConfig}>新增</Button>)}
                {authority(auditPassX)(<Button type='primary' onClick={this.audit.bind(this, 2)} className='ml-8'>审核通过</Button>)}
                {authority(auditNotPassX)(<Button type='primary' onClick={this.audit.bind(this, 3)} className='ml-8'>审核不通过</Button>)}
            </div>
        );
    }
} 