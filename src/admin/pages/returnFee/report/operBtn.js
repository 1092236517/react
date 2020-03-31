import React, { PureComponent } from 'react';
import { Button } from 'antd';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';


export default class extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        const { exportX } = resId.returnFee.report;
        const { exportRecord } = this.props;

        return (
            <div className='mb-16'>
                {authority(exportX)(<Button type='primary' onClick={exportRecord}>导出</Button>)}
            </div>
        );
    }
} 