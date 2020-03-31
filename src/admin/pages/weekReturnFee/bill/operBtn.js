import React, { PureComponent } from 'react';
import { Button, message } from 'antd';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';

export default class extends PureComponent {
    showAuditModal = () => {
        const { selectedRowKeys, showAuditModal } = this.props;
        const rows = selectedRowKeys || [];
        if (rows.length == 0) {
            message.info('请选择一条记录！');
            return;
        }
        window._czc.push(['_trackEvent', '返费周薪账单', '审核', '返费周薪账单_N非结算']);
        showAuditModal();
    }

    render() {
        const { exportX, destroyX, auditX } = resId.weekReturnFee.bill;
        const { exportRecord, destroyBill } = this.props;

        return (
            <div className='mb-16'>
                {authority(exportX)(<Button type='primary' onClick={() => { exportRecord(); window._czc.push(['_trackEvent', '返费周薪账单', '导出', '返费周薪账单_N非结算']); }}>导出</Button>)}
                {authority(destroyX)(<Button type='primary' className="ml-8" onClick={() => { destroyBill(); window._czc.push(['_trackEvent', '返费周薪账单', '作废', '返费周薪账单_N非结算']); }}>作废</Button>)}
                {authority(auditX)(<Button type='primary' className="ml-8" onClick={this.showAuditModal}>审核</Button>)}
            </div>
        );
    }
} 