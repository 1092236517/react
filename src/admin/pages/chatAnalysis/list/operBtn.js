import React, { PureComponent } from 'react';
import { Button } from 'antd';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';

export default class extends PureComponent {
    render() {
        const { exportX } = resId.chatAnalysis.list;
        const { exportRec } = this.props;

        return (
            <div className='mb-16'>
                {authority(exportX)(<Button type='primary' className='ml-8' onClick={() => { exportRec(); window._czc.push(['_trackEvent', '聊天记录查询', '导出', '聊天记录查询_N非结算']); }}>导出</Button>)}
            </div>
        );
    }
} 