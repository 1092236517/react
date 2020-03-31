import React, { PureComponent } from 'react';
import { Button } from 'antd';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';

export default class extends PureComponent {
    render() {
        const { exportX, refreshX } = resId.bAccountManager.laborDepo;
        const { exportRecord, refresh } = this.props;

        return (
            <div className='mb-16'>
                {authority(exportX)(<Button type='primary' onClick={() => { exportRecord(); window._czc.push(['_trackEvent', '劳务押金表', '导出', '劳务押金表_Y结算']); }}>导出</Button>)}
                {authority(refreshX)(<Button type='primary' className='ml-8' onClick={() => { refresh(); window._czc.push(['_trackEvent', '劳务押金表', '刷新', '劳务押金表_Y结算']); }}>刷新</Button>)}
            </div>
        );
    }
} 