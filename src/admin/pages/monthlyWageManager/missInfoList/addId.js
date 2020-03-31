import { createFormField } from 'ADMIN_UTILS/searchFormUtil';
import { Col, Form, Input, Modal, Row } from 'antd';
import { observer } from 'mobx-react';
import React from 'react';

const FormItem = Form.Item;

@observer
class AddIdModal extends React.Component {
    handleOk = () => {
        this.props.form.validateFields((err) => {
            if(err) return;
            this.props.AddOneIdCardRecord();
            window._czc.push(['_trackEvent', '应发未发列表', '填入身份证', '应发未发列表_Y结算']);
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

        return (
            <Modal title = "填入身份证" width = "600px" visible = {this.props.transVisible} onOk = {this.handleOk} onCancel = {this.handleCancel}>
                <Form>
                    <Row>
                        <Col span = {24}>
                            <FormItem {...formItemLayout} label="姓名" style = {{marginBottom: "0"}}>
                                {getFieldDecorator('RealName', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '姓名必填'
                                        }
                                    ]
                                })(<Input placeholder="请输入" />)}
                            </FormItem>
                        </Col>
                    </Row> 
                   
                    <Row>
                        <Col span = {24}>
                            <FormItem {...formItemLayout} label="身份证号" style = {{marginBottom: "0"}}>
                                {getFieldDecorator('IdCardNum')(<Input precision={0} disabled={true} style = {{width: "100%", border: "1px solid #aaa"}}/>)}
                            </FormItem>
                        </Col>
                        <Col span = {24}>
                            <FormItem {...formItemLayout} label="手机号" style = {{marginBottom: "0"}}>
                                {getFieldDecorator('Mobile', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '手机号必填'
                                        },
                                        {
                                            pattern: /^[1][2,3,4,5,6,7,8,9][0-9]{9}$/,
                                            message: "请输入正确的手机号码"
                                        }]
                                })(<Input precision={2} placeholder="请输入" maxLength={11} style = {{width: "100%", border: "1px solid #aaa"}}/>)}
                            </FormItem>
                        </Col>
                    </Row>                         
                        
                </Form>
            </Modal>
        );
    }
}

export default Form.create({
    mapPropsToFields: props => createFormField(props.IdCardInfo),
    onValuesChange: (props, changedValues, allValues) => props.onValuesChange(allValues)
})(AddIdModal);
