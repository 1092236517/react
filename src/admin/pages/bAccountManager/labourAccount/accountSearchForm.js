import 'ADMIN_ASSETS/less/pages/bAccountManager.less';
import { formItemLayout, formLayout, getFormOptLayout, createFormField } from 'ADMIN_UTILS/searchFormUtil';
import { Button, Col, DatePicker, Form, Input, Row, Select } from 'antd';
import { observer } from 'mobx-react';
import React from 'react';

const FormItem = Form.Item;
const Option = Select.Option;

@observer
class SearchForm extends React.Component {
    handleFormReset = () => {
        this.props.handleFormReset();
    }

    handleFormSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) return;
            this.props.resetdetailPageCurrent();
            this.props.handleFormSubmit();
            window._czc.push(['_trackEvent', '劳务账户', '查询', '劳务账户_N非结算']);
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
                            {getFieldDecorator('BillBatchId')(<Input placeholder="请输入"/>)}
                        </FormItem>
                    </Col>
                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label="交易类型">
                            {getFieldDecorator('TradeTyp')(
                                <Select placeholder="请选择">
                                    <Option value = {-9999}>全部</Option>
                                    <Option value = {1}>账户充值</Option>
                                    <Option value = {2}>账户提现</Option>
                                    <Option value = {3}>押金充值</Option>
                                    <Option value = {4}>押金提现</Option>
                                    <Option value = {5}>周薪账单</Option>
                                    <Option value = {6}>月薪账单</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col {...formLayout}>
                        <Row>
                            <Col span={14}>
                                <FormItem labelCol={{span: 8}} wrapperCol={{span: 16}} label="交易时间">
                                    {getFieldDecorator('StartDt')(<DatePicker format="YYYY-MM-DD" style = {{width: '100%'}}
                                        disabledDate={(startValue) =>{
                                            const endValue = getFieldValue('EndDt');
                                            if (!startValue || !endValue) {
                                                return false;
                                            }
                                            return startValue.isAfter(endValue, 'day');
                                        }}/>)}
                                </FormItem>
                            </Col>
                            <Col span={10}>
                                <FormItem labelCol={{span: 1}} wrapperCol={{span: 23}} label="-" colon = {false}>
                                {getFieldDecorator('EndDt')(<DatePicker format="YYYY-MM-DD" style = {{width: '100%'}}
                                    disabledDate={(endValue) =>{
                                        const startValue = getFieldValue('StartDt');
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