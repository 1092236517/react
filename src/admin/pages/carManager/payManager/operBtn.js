import React, { PureComponent } from 'react';
import { Button, message } from 'antd';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';

export default class extends PureComponent {
    render() {
        const { exportX } = resId.carManager.payManager;
        const { exportRec } = this.props;

        return (
            <div className='mb-16'>
                {authority(exportX)(<Button type='primary' className='ml-8' onClick={exportRec}>导出</Button>)}
            </div>
        );
    }
} 