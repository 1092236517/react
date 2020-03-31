import React from 'react';
import { Modal, Form, DatePicker, Spin } from 'antd';
import { observer, inject } from 'mobx-react';
import moment from 'moment';

@inject('listStore')
@observer
class SynchOrderModal extends React.Component {
    handelSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.listStore.saveOrderSynch(values.date);
                this.props.form.resetFields();
                window._czc.push(['_trackEvent', '名单管理', '确认同步', '名单管理_Y结算']);
            }
        });
    }

    handelOnCancel = () => {
        this.props.listStore.setVisible('synchOrderVisible', false);
        this.props.form.resetFields();
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { view } = this.props.listStore;
        const { synchOrderVisible, modalLoading } = view;
        return (
            <Modal
                visible={synchOrderVisible}
                title="请选择要同步的日期范围"
                onOk={this.handelSubmit}
                onCancel={this.handelOnCancel}
                confirmLoading={modalLoading}
            >
                <Spin spinning={modalLoading}>
                    <Form className='text-center ml-8 mb-8'>
                        {
                            getFieldDecorator('date', {
                                rules: [{
                                    required: true,
                                    message: '请选择同步时间'
                                }]
                            })(
                                <DatePicker
                                    style={{ width: '60%' }}
                                    disabledDate={(currentDate) => currentDate && (currentDate.isBefore(moment('2018-11-18'), 'day') || currentDate.isAfter(moment()))} />
                            )
                        }
                    </Form>
                </Spin>
            </Modal>
        );
    }
}
export default Form.create()(SynchOrderModal);
