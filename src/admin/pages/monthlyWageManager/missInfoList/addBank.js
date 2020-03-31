import { createFormField } from 'ADMIN_UTILS/searchFormUtil';
import { Col, Form, Input, Modal, Row, Select, Cascader } from 'antd';
import { observer } from 'mobx-react';
import React from 'react';
import { antAreaOptions } from 'web-react-base-config';
const Option = Select.Option;
const FormItem = Form.Item;

@observer
class AddBankModal extends React.Component {
    handleOk = () => {
        this.props.form.validateFields((err) => {
            if(err) return;
            this.props.AddOneBankCardRecord();
            window._czc.push(['_trackEvent', '应发未发列表', '填入银行卡', '应发未发列表_Y结算']);
        });
    }
    handleCancel = () => {
        this.props.handleFormReset();
        this.props.getVisible();
    }
    
    render () {
        const {form} = this.props;
        const {getFieldDecorator} = form;
        const formItemLayout = {
            labelCol: { span: 4},
            wrapperCol: { span: 16}
        };
        const {bankList} = this.props;

        return (
            <Modal title = "填入银行卡" width = "600px" visible = {this.props.transVisible} onOk = {this.handleOk} onCancel = {this.handleCancel}>
                <Form>
                    <Row>
                        <Col span = {24}>
                            <FormItem {...formItemLayout} label="银行卡号" style = {{marginBottom: "0"}}>
                                {getFieldDecorator('BankCardNum', {
                                    rules: [{
                                        required: true,
                                        message: '银行卡号必填'
                                    },
                                    {
                                        pattern: /(^[\d]{8,19}$)/,
                                        message: "请输入正确的8到19位银行卡号"
                                    }]
                                })(<Input placeholder="请输入" />)}
                            </FormItem>
                        </Col>
                    </Row> 
                   
                    <Row>
                        <Col span = {24}>
                            <FormItem {...formItemLayout} label="银行名称" style = {{marginBottom: "0"}}>
                                {getFieldDecorator('BankName', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '银行名称必填'
                                        }
                                    ]
                                })(<Select
                                    className = "inputbgc"
                                    showSearch
                                    allowClear={true}
                                    placeholder="请选择"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {bankList.map((item, index) => <Select.Option key={index} value={item.BankName}>{item.BankName}</Select.Option>)}
                            </Select>)}
                            </FormItem>
                        </Col>
                        <Col span = {24}>
                            <FormItem {...formItemLayout} label="地区" style = {{marginBottom: "0"}}>
                                {getFieldDecorator('Alladdress', {
                                    rules: [{
                                        required: true,
                                        message: '地区必填'
                                    }]
                                })(<Cascader options={antAreaOptions} placeholder = "请选择"/>)}
                            </FormItem>
                        </Col>
                    </Row>                         
                        
                </Form>
            </Modal>
        );
    }
}

export default Form.create({
    mapPropsToFields: props => createFormField(props.BankCardInfo),
    onValuesChange: (props, changedValues, allValues) => props.onValuesChange(allValues)
})(AddBankModal);
