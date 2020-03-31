import React, { Component } from 'react';
import { Button, Modal, message } from 'antd';

export default class extends Component {
    render() {
        const { batchID, auditBill, closeAuditModal } = this.props;
        return (
            <Modal
                visible={true}
                title='账单审核'
                footer={null}
                onCancel={closeAuditModal}>
                <div className='text-center' style={{ padding: '20px 0' }}>
                    <p className='ml-16'>批次号：{batchID}</p>
                    <div>
                        <Button type='primary' onClick={auditBill.bind(this, batchID, 2)}>同意</Button>
                        <Button type='primary' className='ml-8' onClick={auditBill.bind(this, batchID, 3)}>不同意</Button>
                        <Button className='ml-8' onClick={closeAuditModal}>取消</Button>
                    </div>
                </div>

            </Modal>
        );
    }
}

