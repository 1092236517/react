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
    }

    render() {
        const { exportX } = resId.entryAndExitDetailList;
        const { exportRecord } = this.props;

        return (
            <div className='mb-16'>
                {authority(exportX)(<Button type='primary' onClick={() => { exportRecord(); window._czc.push(['_trackEvent', '到账/出账明细', '导出', '到账/出账明细_N非结算']); }}>导出</Button>)}
            </div>
        );
    }
} 