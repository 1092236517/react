import React from 'react';
import { Modal, Form, DatePicker, Spin } from 'antd';
import { observer, inject } from 'mobx-react';
import moment from 'moment';
import { getFormOptLayout, formItemLayout, formLayout, createFormField } from 'ADMIN_UTILS/searchFormUtil';
@inject('orderStore')
@observer
class SynchOrderModal extends React.Component {
    handelSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.orderStore.saveOrderBatchSynch({ StartDateParam: values.StartDate, EndDateParam: values.EndDate });
                this.props.form.resetFields();
            }
        });
    }

    handelOnCancel = () => {
        this.props.orderStore.setVisible('batchSynchOrderVisible', false);
        this.props.form.resetFields();
    }
    upDateSettleDate = (which, date) => {
        // if (date == null) {
        //     return;
        // }
        // let dateC = date.clone();
        // if (which == 'start') {
        //     dateC.add(3, 'month');
        //     this.props.form.setFieldsValue({
        //         EndDate: dateC
        //     });
        //     if (moment().isBefore(dateC)) {
        //         this.props.form.setFieldsValue({
        //             EndDate: moment()
        //         });
        //     } else {
        //         this.props.form.setFieldsValue({
        //             EndDate: dateC
        //         });
        //     }

        // } else {
        //     dateC.subtract(3, 'month');
        //     this.props.form.setFieldsValue({
        //         StartDate: dateC
        //     });

        // }
    }
    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { view } = this.props.orderStore;
        const { batchSynchOrderVisible, modalLoading } = view;
        return (
            <Modal
                visible={batchSynchOrderVisible}
                title="请选择要批量同步的日期范围"
                onOk={this.handelSubmit}
                onCancel={this.handelOnCancel}
                confirmLoading={modalLoading}
            >
                <Spin spinning={modalLoading}>
                    <Form>
                        <Form.Item label="开始时间" {...formItemLayout}>
                            {getFieldDecorator('StartDate', {
                                initialValue: moment().subtract(3, 'month'),
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择开始同步时间'
                                    }
                                ]
                            })(
                                <DatePicker
                                    allowClear={false}
                                    format="YYYY-MM-DD"
                                    onChange={this.upDateSettleDate.bind(this, 'start')}
                                    disabledDate={(currentDate) =>
                                        getFieldValue('EndDate') ? moment(currentDate).add(3, 'month').isBefore(moment(getFieldValue('EndDate')), 'days') || moment(currentDate).isAfter(moment()) : false
                                    }
                                />
                            )}
                        </Form.Item>
                        <Form.Item label="结束时间" {...formItemLayout}>
                            {getFieldDecorator('EndDate', {
                                initialValue: moment(),
                                rules: [
                                    {
                                        validator: (rule, value, callback) => {
                                            if (!value) {
                                                callback('请选择结束同步时间');
                                            } else {
                                                callback();
                                            }
                                        }
                                    }
                                ]
                            })(
                                <DatePicker
                                    allowClear={false}
                                    format="YYYY-MM-DD"
                                    onChange={this.upDateSettleDate.bind(this, 'end')}
                                    disabledDate={(currentDate) =>
                                        getFieldValue('StartDate') ? moment(currentDate).subtract(3, 'month').isAfter(moment(getFieldValue('StartDate')), 'days') || moment(currentDate).isBefore(moment(getFieldValue('StartDate')), 'days') : false
                                    }
                                />
                            )}
                        </Form.Item>
                    </Form>
                </Spin>
            </Modal>
        );
    }
}
export default Form.create()(SynchOrderModal);
