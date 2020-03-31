import React, { PureComponent } from 'react';
import { Button } from 'antd';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';

export default class extends PureComponent {

    render() {
        const { addX } = resId.basicData.laborDepoMap;
        const { setInfoModalShow } = this.props;

        return (
            <div className='mb-16'>
                {authority(addX)(<Button type='primary' onClick={() => { setInfoModalShow(); window._czc.push(['_trackEvent', '劳务押金关系表', '添加', '劳务押金关系表_Y结算']); }}>添加</Button>)}
            </div>
        );
    }
} 