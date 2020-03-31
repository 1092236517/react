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

        showAuditModal();
        window._czc.push(['_trackEvent', '月薪账单', '审核', '月薪账单_Y结算']);
    }

    render() {
        const { exportX, cancel, confirmX } = resId.monthlyWageManager.bill;
        const { exportRecord, cancelBatch } = this.props;

        return (
            <div className='mb-16'>
                {authority(exportX)(<Button type='primary' onClick={() => { exportRecord(); window._czc.push(['_trackEvent', '月薪账单', '导出', '月薪账单_Y结算']); }}>导出</Button>)}
                {authority(cancel)(<Button type='primary' className='ml-8' onClick={() => { cancelBatch(); window._czc.push(['_trackEvent', '月薪账单', '作废', '月薪账单_Y结算']); }}>作废</Button>)}
                {authority(confirmX)(<Button type='primary' className="ml-8" onClick={this.showAuditModal}>审核</Button>)}
            </div>
        );
    }
} 