import { createFormField } from 'ADMIN_UTILS/searchFormUtil';
import { Col, Form, Input, Modal, Row, Select } from 'antd';
import { observer } from 'mobx-react';
import React from 'react';

const Option = Select.Option;
const FormItem = Form.Item;

@observer
class AddWorkModal extends React.Component {
    handleOk = () => {
        this.props.form.validateFields((err) => {
            if(err) return;
            this.props.AddOneWorkCardRecord();
            window._czc.push(['_trackEvent', '应发未发列表', '填入工牌', '应发未发列表_Y结算']);
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
        const {companyList} = this.props;

        return (
            <Modal title = "填入工牌" width = "600px" visible = {this.props.transVisible} onOk = {this.handleOk} onCancel = {this.handleCancel}>
                <Form>
                    <Row>
                        <Col span = {24}>
                            <FormItem {...formItemLayout} label="企业" style = {{marginBottom: "0"}}>
                                {getFieldDecorator('EntId', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '企业必填'
                                        }]
                                })(<Select showSearch
                                    allowClear={true}
                                    placeholder="请选择"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                {
                                    companyList.length > 0 ? companyList.map((item, index) => {
                                        return (
                                            <Option key={index} value={item.EntId}>{item.EntShortName}</Option>
                                        );
                                    }) : null
                                } 
                                </Select>)}
                            </FormItem>
                        </Col>
                    </Row> 
                   
                    <Row>
                        <Col span = {24}>
                            <FormItem {...formItemLayout} label="工号" style = {{marginBottom: "0"}}>
                                {getFieldDecorator('WorkCardNo', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '工号必填'
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
    mapPropsToFields: props => createFormField(props.WorkCardInfo),
    onValuesChange: (props, changedValues, allValues) => props.onValuesChange(allValues)
})(AddWorkModal);
