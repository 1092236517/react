import React, { PureComponent } from 'react';
import { Button, message, Modal } from 'antd';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import { editDetail } from 'ADMIN_SERVICE/ZXX_ReturnFee';

export default class extends PureComponent {
    sendLabor = (sts) => {
        const { selectedRowKeys, reloadData } = this.props;
        if (selectedRowKeys.length == 0) {
            message.info('请选择要操作的记录！');
            return;
        }

        Modal.confirm({
            title: '信息',
            content: `是否修改为${{ 1: '未发', 2: '已发' }[sts]}劳务`,
            onOk: () => {
                let reqParam = {
                    FfDetailId: selectedRowKeys,
                    UpdateTrgtIsSendType: sts
                };
                editDetail(reqParam).then((resData) => {
                    message.success('修改成功！');
                    reloadData();
                }).catch((err) => {
                    message.error(err.message);
                    console.log(err);
                });
            }
        });
    }

    render() {
        const { exportX, hasSendLaborX, notSendLaborX } = resId.returnFee.detail;
        const { exportRecord } = this.props;

        return (
            <div className='mb-16'>
                {authority(exportX)(<Button type='primary' onClick={exportRecord}>导出</Button>)}
                {authority(hasSendLaborX)(<Button type='primary' className='ml-8' onClick={this.sendLabor.bind(this, 2)}>已发劳务</Button>)}
                {authority(notSendLaborX)(<Button type='primary' className='ml-8' onClick={this.sendLabor.bind(this, 1)}>未发劳务</Button>)}
            </div>
        );
    }
} 