import React, { Component } from 'react';
import { observer } from "mobx-react";
import { Form, Input, Modal, InputNumber } from 'antd';
import { createFormField } from 'ADMIN_UTILS/searchFormUtil';


const FormItem = Form.Item;
@observer
class InfoModal extends Component {
    saveData = (e) => {
        e.preventDefault();
        const {
            view: {
                infoModal: { record }
            }
        } = this.props.bankPayAccountStore;
        window._czc.push(['_trackEvent', '银行付款账号管理', record ? '保存修改' : '保存新增', '银行付款账号管理_Y结算']);
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }

            this.props.bankPayAccountStore.saveData(fieldsValue);
        });
    }


    render() {
        const formItemLayout = { labelCol: { xs: { span: 24 }, sm: { span: 8 } }, wrapperCol: { xs: { span: 24 }, sm: { span: 10 } } };

        const { getFieldDecorator } = this.props.form;
        const {
            view: {
                infoModal: { record }
            },
            setInfoModalShow
        } = this.props.bankPayAccountStore;

        return (
            <Modal
                visible={true}
                onOk={this.saveData}
                title={record ? '修改' : '新增'}
                onCancel={setInfoModalShow.bind(this, false)}>
                <Form onSubmit={this.saveData}>
                    <FormItem style={{ display: 'none' }}>
                        {getFieldDecorator('PayAccntId')(
                            <Input />
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label='付款账号'>
                        {getFieldDecorator('BankCardNum', {
                            rules: [
                                { required: true, message: '请输入付款账号' },
                                { pattern: /^\d+$/, message: '请输入正确的付款账号' }
                            ]
                        })(
                            <Input maxLength={20} placeholder='请输入' />
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label='付款账号名称'>
                        {getFieldDecorator('BankAccntName', {
                            rules: [{ required: true, message: '请输入付款账号名称' }]
                        })(
                            <Input maxLength={50} placeholder='请输入' />
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label='登录客户ID'>
                        {getFieldDecorator('BankLoginAccnt', {
                            rules: [
                                { required: true, message: '请输入登录客户ID' },
                                { pattern: /^\d+$/, message: '请输入正确的登录客户ID' }
                            ]
                        })(
                            <Input maxLength={50} placeholder='请输入' />
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label='开户银行名称'>
                        {getFieldDecorator('BankName', {
                            rules: [{ required: true, message: '请输入开户银行名称' }]
                        })(
                            <Input maxLength={20} placeholder='请输入' />
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label='前置机IP'>
                        {getFieldDecorator('FrontIp', {
                            rules: [
                                { required: true, message: '请输入前置机IP' },
                                { pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/, message: '请输入合法的IP地址' }
                            ]
                        })(
                            <Input maxLength={16} placeholder='请输入' />
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label='前置机端口'>
                        {getFieldDecorator('FrontPort', {
                            rules: [{ required: true, message: '请输入前置机端口' }]
                        })(
                            <InputNumber maxLength={5} min={1} max={65535} placeholder='请输入' className='w-100' />
                        )}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

InfoModal = Form.create({
    mapPropsToFields: props => {
        const { record } = props.bankPayAccountStore.view.infoModal;
        if (record) {
            return createFormField(record);
        }
    }
})(InfoModal);

export default InfoModal;