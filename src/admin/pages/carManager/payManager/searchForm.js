import React, { Component } from 'react';
import { observer } from "mobx-react";
import { Form, Row, Col, Button, Select, Input, DatePicker } from 'antd';
import { getFormOptLayout, formItemLayout, formLayout, createFormField } from 'ADMIN_UTILS/searchFormUtil';
import { selectInputSearch } from 'ADMIN_UTILS';
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;

@observer
class SearchForm extends Component {
    startQuery = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err) => {
            if (err) {
                return;
            }

            const { startQuery, resetPageCurrent } = this.props;
            resetPageCurrent();
            startQuery();
        });
    }

    render() {
        const { form: { getFieldDecorator, getFieldValue }, resetForm, companyList, laborList } = this.props;
        const formOptLayout = getFormOptLayout(3);

        return (
            <Form onSubmit={this.startQuery}>
                <Row gutter={15} type="flex" justify="start">
                    <Col {...formLayout}>
                        <Row>
                            <Col span={14}>
                                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="时间">
                                    {getFieldDecorator('PayTimeStart')(
                                        <DatePicker disabledDate={(startValue) => {
                                            const endValue = getFieldValue('PayTimeEnd');
                                            if (startValue) {
                                                return startValue.isAfter(moment(), 'day') || startValue.isAfter(endValue, 'day');
                                            }

                                            return false;
                                        }} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={10}>
                                <FormItem labelCol={{ span: 1 }} wrapperCol={{ span: 23 }} label="-">
                                    {getFieldDecorator('PayTimeEnd')(
                                        <DatePicker disabledDate={(endValue) => {
                                            const startValue = getFieldValue('PayTimeStart');
                                            if (!endValue || !startValue) {
                                                return false;
                                            }
                                            return endValue.isBefore(startValue, 'day') || endValue.isAfter(moment(), 'day');
                                        }} />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>

                    <Col {...formLayout}>
                        <Form.Item label="支付状态" {...formItemLayout}>
                            {getFieldDecorator('PaySts')(
                                <Select placeholder="请选择">
                                    <Select.Option value={-9999}>全部</Select.Option>
                                    <Select.Option value={1}>成功</Select.Option>
                                    <Select.Option value={2}>失败</Select.Option>
                                </Select>
                            )}
                        </Form.Item>
                    </Col>


                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='条件搜索'>
                            {getFieldDecorator('SelectParam')(
                                <Input placeholder='请输入姓名、身份证或手机号' />
                            )}
                        </FormItem>
                    </Col>


                    <Col {...formOptLayout} className='text-right' >
                        <FormItem label=''>
                            <Button onClick={resetForm}>重置</Button>
                            <Button type='primary' htmlType='submit' className='ml-8'>查询</Button>
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