import React, { Component } from 'react';
import { observer } from "mobx-react";
import { Form, Row, Col, DatePicker, Button, Select, Input } from 'antd';
import { getFormOptLayout, formItemLayout, formLayout, createFormField } from 'ADMIN_UTILS/searchFormUtil';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;

class SearchForm extends Component {
    constructor(props) {
        super(props);
    }

    startQuery = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            const { startQuery, resetPageCurrent } = this.props;
            resetPageCurrent();
            startQuery();
            window._czc.push(['_trackEvent', '公告推送管理', '查询', '公告推送管理_N非结算']);
        });
    }

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const formOptLayout = getFormOptLayout(3);
        const { resetForm } = this.props;

        return (
            <Form onSubmit={this.startQuery}>
                <Row gutter={10} type="flex" justify="start">
                    <Col {...formOptLayout}>
                        <FormItem {...formItemLayout} label='标题关键字'>
                            {getFieldDecorator('KeyWords', {
                            })(
                                <Input maxLength={55} placeholder='标题关键字' />
                            )}
                        </FormItem>
                    </Col>

                    <Col {...{
                        sm: { span: 24, offset: 0 },
                        md: { span: 12, offset: 0 },
                        lg: { span: 6, offset: 0 }
                    }}>
                        <Row>
                            <Col span={14}>
                                <FormItem labelCol={{ span: 9 }} wrapperCol={{ span: 15 }} label="日期范围">
                                    {getFieldDecorator('BeginDt')(
                                        <DatePicker
                                            disabledDate={(startValue) => {
                                                const endValue = getFieldValue('EndDt');
                                                if (!startValue || !endValue) {
                                                    return false;
                                                }
                                                return startValue.isAfter(endValue, 'day');
                                            }} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={10}>
                                <FormItem labelCol={{ span: 1 }} wrapperCol={{ span: 23 }} label="-">
                                    {getFieldDecorator('EndDt')(
                                        <DatePicker
                                            disabledDate={(endValue) => {
                                                const startValue = getFieldValue('BeginDt');
                                                if (!endValue || !startValue) {
                                                    return false;
                                                }
                                                return endValue.isBefore(startValue, 'day');
                                            }} />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>
                    <Col {...formOptLayout} className='text-right'>
                        <FormItem>
                            <Button onClick={resetForm} >重置</Button>
                            <Button type="primary" htmlType="submit" className="ml-8">查询</Button>
                        </FormItem>
                    </Col>

                </Row>
            </Form>
        );
    }
}

SearchForm = Form.create({
    mapPropsToFields: props => (createFormField(props.searchValue)),
    onValuesChange: (props, changedValues, allValues) => (props.handleFormValuesChange(allValues))
})(SearchForm);

export default SearchForm;