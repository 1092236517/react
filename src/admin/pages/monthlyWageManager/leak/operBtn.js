import React, { PureComponent } from 'react';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import { Button, message } from 'antd';

export default class extends PureComponent {
    handleData = () => {
        const { selectedRowKeys, showModal } = this.props;
        if (selectedRowKeys.length == 0) {
            message.info('请选择要操作的记录！');
            return;
        }
        window._czc.push(['_trackEvent', '月薪查漏', '批量处理', '月薪查漏_Y结算']);
        showModal(selectedRowKeys);
    }


    render() {
        const { exportX, operDataX } = resId.monthlyWageManager.leak;
        const { exportData } = this.props;

        return (
            <div className='mb-16'>
                {authority(operDataX)(<Button type='primary' onClick={this.handleData}>批量处理</Button>)}
                {authority(exportX)(<Button type='primary' className='ml-8' onClick={() => { exportData(); window._czc.push(['_trackEvent', '月薪查漏', '导出', '月薪查漏_Y结算']); }}>导出</Button>)}
            </div>
        );
    }
}