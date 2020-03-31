import React, { PureComponent } from 'react';
import { Button } from 'antd';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';

export default class extends PureComponent {
    render() {
        const { exportX } = resId.settleMgr.settleDetail;
        return (
            <div className='mb-16'>
                {authority(exportX)(<Button type='primary' onClick={this.addConfig}>导出</Button>)}
            </div>
        );
    }
} 