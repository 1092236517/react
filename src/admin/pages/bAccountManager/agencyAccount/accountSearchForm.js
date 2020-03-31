import 'ADMIN_ASSETS/less/pages/bAccountManager.less';
import { formItemLayout, formLayout, getFormOptLayout, createFormField } from 'ADMIN_UTILS/searchFormUtil';
import { Button, Col, DatePicker, Form, Input, Row } from 'antd';
import { observer } from 'mobx-react';
import React from 'react';

const FormItem = Form.Item;

@observer
class SearchForm extends React.Component {
    handleFormReset = () => {
        this.props.handleFormReset();
    }
    handleFormSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err) => {
            if (err) return;
            this.props.resetdetailPageCurrent();
            this.props.handleFormSubmit();
            window._czc.push(['_trackEvent', '中介费到账记录', '查看', '中介费到账记录_N非结算']);
        });
    }

    render() {
        const {form} = this.props;
        const {getFieldDecorator, getFieldValue} = form;
        const formOptLayout = getFormOptLayout(3);

        return (
            <Form onSubmit = {this.handleFormSubmit}>
                <Row>
                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label="批次号">
                            {getFieldDecorator('BatchId')(<Input placeholder="请输入"/>)}
                        </FormItem>
                    </Col>

                    <Col span = {12}>
                        <Row>
                            <Col span={12}>
                                <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="交易时间">
                                    {getFieldDecorator('BeginDt')(<DatePicker format="YYYY-MM-DD" style = {{width: '100%'}}
                                        disabledDate={(startValue) =>{
                                            const endValue = getFieldValue('EndDt');
                                            if (!startValue || !endValue) {
                                                return false;
                                            }
                                            return startValue.isAfter(endValue, 'day');
                                        }}/>)}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem labelCol={{span: 1}} wrapperCol={{span: 23}} label="-" colon = {false}>
                                {getFieldDecorator('EndDt')(<DatePicker format="YYYY-MM-DD" style = {{width: '100%'}}
                                    disabledDate={(endValue) =>{
                                        const startValue = getFieldValue('BeginDt');
                                            if (!endValue || !startValue) {
                                                return false;
                                            }
                                            return endValue.isBefore(startValue, 'day');
                                    }}/>)}
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>

                    <Col {...formOptLayout} className='text-right'>
                        <FormItem>
                            <Button onClick={this.handleFormReset}>重置</Button>
                            <Button className="ml-8" type="primary" htmlType="submit">查询</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
          
        );
    }
}

export default Form.create({
    mapPropsToFields: props => createFormField(props.detailValue),
    onValuesChange: (props, changeValues, allValues) => props.onValuesChange(allValues)
})(SearchForm);