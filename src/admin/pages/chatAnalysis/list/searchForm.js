import React, { Component } from 'react';
import { observer } from "mobx-react";
import { Form, Row, Col, Input, DatePicker, Button, Select } from 'antd';
import { formItemLayout, formLayout, getFormOptLayout, createFormField } from 'ADMIN_UTILS/searchFormUtil';
const FormItem = Form.Item;
const { Option } = Select;
import moment from 'moment';
@observer
class SearchForm extends Component {
    startQuery = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }

            const { startQuery, resetPageCurrent } = this.props;
            resetPageCurrent();
            startQuery();
            window._czc.push(['_trackEvent', '聊天记录查询', '查询', '聊天记录查询_N非结算']);
        });
    }

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { handleFormReset } = this.props;
        const formOptLayout = getFormOptLayout(6);

        return (
            <Form onSubmit={this.startQuery}>
                <Row gutter={15} type="flex" justify="start">

                    <Col {...formLayout}>
                        <Row>
                            <Col span={14}>
                                <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="搜索日期">
                                    {getFieldDecorator('BeginDay', {
                                        initialValue: moment(),
                                        rules: [
                                            {
                                                required: true,
                                                message: '开始日期不能为空'
                                            }
                                        ]
                                    })(
                                        <DatePicker disabledDate={(startValue) => {
                                            const endValue = getFieldValue('EndDay');
                                            if (!startValue || !endValue) {
                                                return false;
                                            }
                                            return startValue.isAfter(endValue, 'day');
                                        }} />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={10}>
                                <Form.Item labelCol={{ span: 1 }} wrapperCol={{ span: 23 }} label="-">
                                    {getFieldDecorator('EndDay', {
                                        initialValue: moment(),
                                        rules: [
                                            {
                                                validator: (rule, value, callback) => {
                                                    if (!value) {
                                                        callback('结束日期不能为空');
                                                    } else {
                                                        callback();
                                                    }
                                                }
                                            }
                                        ]
                                    })(
                                        <DatePicker disabledDate={(endValue) => {
                                            const startValue = getFieldValue('BeginDay');
                                            if (!endValue || !startValue) {
                                                return false;
                                            }
                                            return endValue.isBefore(startValue, 'day');
                                        }} />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>


                    <Col {...formLayout}>
                        <FormItem {...formItemLayout}
                            label="门店名称">
                            {getFieldDecorator('HubName')(<Input placeholder="请输入" maxLength={10} />)}
                        </FormItem>
                    </Col>
                    <Col {...formOptLayout} className="text-right">
                        <FormItem>
                            <Button onClick={handleFormReset}>重置</Button>
                            <Button type="primary" htmlType="submit" className="ml-8">查询</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    }
}

SearchForm = Form.create({
    mapPropsToFields: props => createFormField(props.searchValue),
    onValuesChange: (props, changedValues, allValues) => props.handleFormValuesChange(allValues)
})(SearchForm);

export default SearchForm;