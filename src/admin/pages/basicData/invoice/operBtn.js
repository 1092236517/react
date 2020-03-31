import React, { PureComponent } from 'react';
import { Button, message } from 'antd';
import authority from 'ADMIN_COMPONENTS/Authority';
import { auditInvoice } from 'ADMIN_SERVICE/ZXX_BaseData';
import resId from 'ADMIN_CONFIG/resId';

export default class extends PureComponent {
    auditInvoice = async (sts) => {
        const { selectedRowKeys, startQuery } = this.props;
        const rows = selectedRowKeys || [];
        if (rows.length == 0) {
            message.info('请至少选择一条记录！');
            return;
        }

        const reqParam = {
            AuditSts: sts,
            DataIds: rows
        };

        try {
            window._czc.push(['_trackEvent', '开票信息', sts == 2 ? '审核通过' : sts == 3 ? '审核不通过' : '', '开票信息_Y结算']);
            await auditInvoice(reqParam);
            message.success('操作成功！');
            startQuery();
        } catch (err) {
            message.error(err.message);
            console.log(err);
        }
    }

    render() {
        const { addX, auditPassX, auditNotPassX, exportRecordX } = resId.basicData.invoice;
        const { showDetail, auditPass, auditNotPass, exportRecord } = this.props;

        return (
            <div className='mb-16'>
                {authority(addX)(<Button type='primary' onClick={() => { showDetail(); window._czc.push(['_trackEvent', '开票信息', '新增', '开票信息_Y结算']); }}>新增</Button>)}
                {authority(auditPassX)(<Button type='primary' className='ml-8' onClick={this.auditInvoice.bind(this, 2)}>审核通过</Button>)}
                {authority(auditNotPassX)(<Button type='primary' className='ml-8' onClick={this.auditInvoice.bind(this, 3)}>审核不通过</Button>)}
                {authority(exportRecordX)(<Button type='primary' className='ml-8' onClick={() => { exportRecord(); window._czc.push(['_trackEvent', '开票信息', '导出', '开票信息_Y结算']); }}>导出</Button>)}

            </div>
        );
    }
} 