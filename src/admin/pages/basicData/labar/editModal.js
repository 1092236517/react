import React from 'react';
import {Modal, Form, Input, Select, Spin} from 'antd';
import {observer, inject} from 'mobx-react';
import 'ADMIN_ASSETS/less/pages/baseData.less';
const formItemLayout = {
    labelCol: {span: 5},
    wrapperCol: {span: 19}
};
@inject('labarStore', 'globalStore')
@observer
class EditModal extends React.Component {

    handleSubmit = (e) => {
        window._czc.push(['_trackEvent', '劳务基础数据', '保存编辑', '劳务基础数据_N非结算']);
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
           if(!err) {
               for(let key in values) {
                   values[key] === undefined && delete values[key];
               }
               this.props.labarStore.handleSave(values);
           }
        });
    }

    handleCancel = (e) => {
        e.preventDefault();
        this.props.labarStore.setVisible('editVisible', false);
        this.props.form.resetFields();
    }

    render() {
        const { bankList } = this.props;
        const {view} = this.props.labarStore;
        const {modalLoading, recordDataSource, editVisible} = view;
        const {getFieldDecorator} = this.props.form;
        return (
            <Modal
                className="agent"
                title="编辑"
                visible={editVisible}
                onOk={this.handleSubmit}
                onCancel={this.handleCancel}
                confirmLoading={modalLoading}
            >
                <Spin spinning={modalLoading}>
                    <Form className="modal">
                        <Form.Item style={{display: 'none'}}>
                            {
                                getFieldDecorator('SpTyp', {
                                    initialValue: 2
                                })(
                                    <Input className="input-none" disabled={true} />
                                )
                            }
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="劳务ID">
                            {
                                getFieldDecorator('SpId', {
                                    initialValue: recordDataSource.SpId
                                })(
                                    <Input className="input-none" disabled={true} />
                                )
                            }
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="劳务全称">
                            <span className="pl-4">{recordDataSource.SpFullName}</span>
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="劳务简称">
                            {
                                getFieldDecorator('SpShortName', {
                                    initialValue: recordDataSource.SpShortName
                                })(
                                    <Input className="input-none" disabled={true} />
                                )
                            }
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="联系人">
                            {
                                getFieldDecorator('CtctName', {
                                    initialValue: recordDataSource.CtctName,
                                    rules: [
                                        {
                                            pattern: /^[\u4e00-\u9fa5]+$/,
                                            message: '请输入中文'
                                        }
                                    ]
                                })(
                                    <Input placeholder="请输入" maxLength={10}/>
                                )
                            }
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="联系手机">
                            {
                                getFieldDecorator('CtctMobile', {
                                    initialValue: recordDataSource.CtctMobile,
                                    rules: [
                                        {
                                            pattern: /^1[3-9][0-9]\d{8}$/,
                                            message: '请输入正确的手机号格式'
                                        }
                                    ]
                                })(
                                    <Input placeholder="请输入" maxLength={11}/>
                                )
                            }
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="银行名称">
                            {
                                getFieldDecorator('BankName', {
                                    initialValue: recordDataSource.BankName || undefined
                                })(

                                    <Select
                                        showSearch
                                        allowClear={true}
                                        placeholder="请选择"
                                        optionFilterProp="children"
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        {bankList.map((item, index) => <Select.Option key={index} value={item.BankName}>{item.BankName}</Select.Option>)}
                                    </Select>
                                )
                            }
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="银行账号">
                            {
                                getFieldDecorator('BankCardNo', {
                                    initialValue: recordDataSource.BankCardNo,
                                    rules: [
                                        {
                                            pattern: /(^[\d]{8,19}$)/,
                                            message: "请输入正确的8到19位银行卡号"
                                        }
                                    ]
                                })(
                                    <Input placeholder="请输入" maxLength={19}/>
                                )
                            }
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="银行账号名">
                            {
                                getFieldDecorator('BankAccountName', {
                                    initialValue: recordDataSource.BankAccountName
                                })(
                                    <Input placeholder="请输入" maxLength={50}/>
                                )
                            }
                        </Form.Item>
                    </Form>
                </Spin>
            </Modal>
        );
    }
}

export default Form.create()(EditModal);
