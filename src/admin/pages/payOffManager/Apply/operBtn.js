import React, { PureComponent } from 'react';
import { Button } from 'antd';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';

export default class extends PureComponent {
    render() {
        const { add: addX, submitAudit: submitAuditX } = resId.applyList;
        const { startApply, submitBatch } = this.props;

        return (
            <div className='mb-16'>
                {authority(addX)(<Button type="primary" onClick={() => { startApply(); window._czc.push(['_trackEvent', '发薪申请', '新增申请', '发薪申请_Y结算']); }}>新增申请</Button>)}
                {authority(submitAuditX)(<Button className="ml-8" type="primary" onClick={() => { submitBatch(); window._czc.push(['_trackEvent', '发薪申请', '批量授权', '发薪申请_Y结算']); }}>批量授权</Button>)}
            </div>
        );
    }
} 
