import React from 'react';
import {Modal, Form, DatePicker, Spin} from 'antd';
import {observer, inject} from 'mobx-react';
import moment from 'moment';

@inject('orderStore')
@observer
class SynchOrderModal extends React.Component {
    handelSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
           if(!err) {
               this.props.orderStore.saveOrderSynch(values.date);
               this.props.form.resetFields();
               ;window._czc.push(['_trackEvent', '订单管理', '确认同步', '订单管理_Y结算']);
           }
        });
    }

    handelOnCancel = () => {
        this.props.orderStore.setVisible('synchOrderVisible', false);
        this.props.form.resetFields();
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {view} = this.props.orderStore;
        const {synchOrderVisible, modalLoading} = view;
        return (
            <Modal
                visible={synchOrderVisible}
                title="请选择要同步的日期范围"
                onOk={this.handelSubmit}
                onCancel={this.handelOnCancel}
                confirmLoading={modalLoading}
            >
                <Spin spinning={modalLoading}>
                    <Form>
                        <Form.Item>
                            {
                                getFieldDecorator('date', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择同步时间'
                                        }
                                    ]
                                })(
                                    <DatePicker
                                        disabledDate={(currentDate) => currentDate && (currentDate.isBefore(moment('2018-11-18'), 'day') || currentDate.isAfter(moment()))}/>
                                )
                            }
                        </Form.Item>
                    </Form>
                </Spin>
            </Modal>
        );
    }
}
export default Form.create()(SynchOrderModal);
