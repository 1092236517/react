import React, { Component } from 'react';
import { observer } from "mobx-react";
import { Form, Modal, message, Select, Input } from 'antd';
import { addRemindReceiver, updateRemindReceiver } from 'ADMIN_SERVICE/ZXX_BaseData';
import { createFormField } from 'ADMIN_UTILS/searchFormUtil';
const FormItem = Form.Item;
const { Option } = Select;

@observer
class InfoModal extends Component {
    saveData = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            if (this.props.modalTitle === 'addModal') {
                window._czc.push(['_trackEvent', '月薪短信配置', '保存添加', '月薪短信配置_Y结算']);
                addRemindReceiver(fieldsValue).then((res) => {
                    const { startQuery, closeModal } = this.props;
                    message.success('添加成功！');
                    startQuery();
                    closeModal();
                }).catch((err) => {
                    message.error(err.message);
                    console.log(err);
                });
            } else {
                const { RecordID } = this.props.modalValue;
                fieldsValue['RecordID'] = RecordID;
                window._czc.push(['_trackEvent', '月薪短信配置', '保存修改', '月薪短信配置_Y结算']);
                updateRemindReceiver(fieldsValue).then((res) => {
                    const { startQuery, closeModal } = this.props;
                    message.success('修改成功！');
                    startQuery();
                    closeModal();
                }).catch((err) => {
                    message.error(err.message);
                    console.log(err);
                });
            }

        });
    }


    render() {
        const formItemLayout = { labelCol: { xs: { span: 24 }, sm: { span: 8 } }, wrapperCol: { xs: { span: 24 }, sm: { span: 10 } } };
        const {
            form: {
                getFieldDecorator
            },
            closeModal,
            modalTitle

        } = this.props;
        const modalTitleName = modalTitle === 'addModal' ? '新增' : '修改';
        return (
            <Modal
                visible={true}
                onOk={this.saveData}
                title={modalTitleName}
                onCancel={closeModal}>
                <Form onSubmit={this.saveData}>
                    <FormItem {...formItemLayout} label='姓名'>
                        {getFieldDecorator('RealName', { rules: [{ required: true, message: '请输入姓名' }] })(<Input placeholder='请输入' maxLength={10} />)}
                    </FormItem>
                    <FormItem {...formItemLayout} label='手机号'>
                        {getFieldDecorator('Mobile', {
                            rules: [
                                { required: true, message: '请输入手机号' },
                                {
                                    pattern: /^1[3-9][0-9]\d{8}$/,
                                    message: '请输入正确的手机号格式'
                                }
                            ]
                        })(<Input placeholder='请输入' maxLength={11} />)}
                    </FormItem>
                    <FormItem label="是否生效" {...formItemLayout}>
                        {getFieldDecorator('IsValid', {
                            rules: [{ required: true, message: '是否生效' }]
                        })(
                            <Select placeholder="请选择">
                                <Option value={1}>是</Option>
                                <Option value={2}>否</Option>
                            </Select>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}


InfoModal = Form.create({
    mapPropsToFields: props => (createFormField(props.modalValue))
    // onValuesChange: (props, changedValues, allValues) => (
    //     props.handleFormValuesChange(allValues))
})(InfoModal);

export default InfoModal;