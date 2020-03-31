import React, { PureComponent } from 'react';
import { Button, message, Modal } from 'antd';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import { auditRemit } from 'ADMIN_SERVICE/ZXX_ReturnFee';

export default class extends PureComponent {
    audit = (sts) => {
        const { selectedRowKeys, reloadData } = this.props;
        if (selectedRowKeys.length == 0) {
            message.info('请选择要操作的记录！');
            return;
        }

        Modal.confirm({
            title: '信息',
            content: `确认${{ 2: '审核通过', 3: '审核不通过' }[sts]}选中数据吗？`,
            onOk: () => {
                let reqParam = {
                    DataIds: selectedRowKeys,
                    AuditSts: sts
                };
                auditRemit(reqParam).then((resData) => {
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
        const { auditPassX, auditNotPassX, exportX } = resId.returnFee.remitAudit;
        const { exportRecord } = this.props;

        return (
            <div className='mb-16'>
                {authority(auditPassX)(<Button type='primary' onClick={this.audit.bind(this, 2)}>审核通过</Button>)}
                {authority(auditNotPassX)(<Button type='primary' onClick={this.audit.bind(this, 3)} className='ml-8'>审核不通过</Button>)}
                {authority(exportX)(<Button type='primary' onClick={exportRecord} className='ml-8'>导出</Button>)}
            </div>
        );
    }
} 