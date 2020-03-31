import React from 'react';
import { Input, Button, Form, Modal, Spin, Switch, TreeSelect } from 'antd';
import { observer } from "mobx-react";
import { toJS } from 'mobx';
import { createFormField } from 'ADMIN_UTILS/searchFormUtil';

const FormItem = Form.Item;

@observer
class AddUserModel extends React.Component {
    handleCancel = () => {
        this.props.hiddenAddModel();
    }

    handleOk = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                this.props.saveAddModeValue();
                window._czc.push(['_trackEvent', '用户管理', '管理角色保存', '用户管理_N非结算']);
            }
        });
    }

    render() {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        let roleList = this.props.roleList;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 15 }
        };
        const tProps = {
            treeData: toJS(roleList),
            treeCheckable: true
            // showCheckedStrategy: SHOW_PARENT
        };
        return (
            <Modal
                title={this.props.cityModelName.addModelName}
                wrapClassName="vertical-center-modal"
                visible={this.props.cityModelName.addModel}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={[
                    <Button key="back" onClick={this.handleCancel}>取消</Button>,
                    <Button key="submit" type="primary" loading={this.props.getBillListStatus} onClick={this.handleOk}>确定</Button>
                ]}
            >
                <Spin size="large" spinning={this.props.getBillListStatus}>
                    <Form>
                        <FormItem
                            {...formItemLayout}
                            label="管理角色"
                        >
                            {getFieldDecorator('RIDs', {
                                rules: [
                                    { required: true, message: '请选择角色!' }
                                ]
                            })(
                                <TreeSelect {...tProps} />
                            )}
                        </FormItem>
                        <FormItem
                            label="手机号"
                            {...formItemLayout}
                        >
                            {
                                getFieldDecorator('Mobile', {
                                    rules: [{
                                        required: true, message: '请填写手机号!'
                                    }, {
                                        pattern: /^1[3-9][0-9]\d{8}$/,
                                        message: '请输入11位手机号'
                                    }]
                                })(
                                    <Input />
                                )
                            }
                        </FormItem>
                        <FormItem
                            label="真实姓名"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('CnName', {
                                rules: [{
                                    required: true, message: '请填写真实姓名!'
                                }, {
                                    pattern: /^[\u4e00-\u9fa5]+$/,
                                    message: '姓名为中文'
                                }]
                            })(
                                <Input maxLength="10" placeholder="请输入真实姓名" />
                            )}
                        </FormItem>
                        <FormItem
                            label="英文姓名"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('EnName', {
                                rules: [{
                                    pattern: /^(?!_)([A-Za-z ]+)$/,
                                    message: '姓名为英文'
                                }]
                            })(
                                <Input maxLength="10" placeholder="请填写英文姓名" />
                            )}
                        </FormItem>
                        <FormItem
                            label="昵称"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('Nickname', {
                                rules: [{
                                    pattern: /^[\u4e00-\u9fa5a-zA-Z]+$/,
                                    message: '姓名为中文或英文'
                                }]
                            })(
                                <Input maxLength="10" placeholder="请填写昵称" />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label={<span><span style={{ color: 'red' }}>*</span>是否有效</span>}
                        >
                            {getFieldDecorator('IsValide', { valuePropName: 'checked' })(
                                <Switch />
                            )}
                        </FormItem>
                    </Form>
                </Spin>
            </Modal>
        );
    }
}

export default Form.create({
    mapPropsToFields: props => createFormField(props.cityModelValue),
    onValuesChange: (props, changedValues, allValues) => props.onValuesChange(allValues)
})(AddUserModel);