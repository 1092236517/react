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
        const { exportX } = resId.weekReturnFee.bill;
        const { addNoticeOpt } = this.props;

        return (
            <div className='mb-16'>
                <Button type='primary' onClick={() => { addNoticeOpt(); window._czc.push(['_trackEvent', '公告推送管理', '新增', '公告推送管理_N非结算']); }}>新增</Button>
            </div>
        );
    }
} 