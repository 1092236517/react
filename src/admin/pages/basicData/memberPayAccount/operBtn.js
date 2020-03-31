import React, { PureComponent } from 'react';
import { Button, message } from 'antd';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';

export default class extends PureComponent {
    render() {
        const { addAccountX, exportX } = resId.basicData.memberPayAccount;
        const { exportRec, setInfoModalShow } = this.props;

        return (
            <div className='mb-16'>
                {authority(addAccountX)(<Button type='primary' onClick={() => { setInfoModalShow(true); window._czc.push(['_trackEvent', '会员打款虚拟子账户', '新增', '会员打款虚拟子账户_Y结算']); }}>新增</Button>)}
                {authority(exportX)(<Button type='primary' className='ml-8' onClick={exportRec}>导出</Button>)}
            </div>
        );
    }
} 