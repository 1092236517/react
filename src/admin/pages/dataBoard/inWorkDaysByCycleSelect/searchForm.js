import { createFormField, formLayout, getFormOptLayout } from 'ADMIN_UTILS/searchFormUtil';
import { Button, Col, DatePicker, Form, Row, Select } from 'antd';
import { observer } from "mobx-react";
import moment from 'moment';
import React, { Component } from 'react';

const FormItem = Form.Item;
const Option = Select.Option;
const { MonthPicker } = DatePicker;
@observer
class SearchForm extends Component {
    startQuery = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }

            const { startQuery, resetPageCurrent } = this.props.inWorkDaysByCycleSelectStore;
            resetPageCurrent();
            startQuery();
            window._czc.push(['_trackEvent', '在职天数查询(优化版)', '查询', '在职天数查询(优化版)_N非结算']);
        });
    }
    handleReset = (e) => {
        const { resetFields, setFieldsValue } = this.props.form;
        resetFields();
        // 手动清空，触发form的onValuesChange事件
        setFieldsValue({
            TrgtSpId: null
        });
    }

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const formOptLayout = getFormOptLayout(5);
        const { agentList, companyList, laborList } = this.props.globalStore;
        return (
            <Form onSubmit={this.startQuery}>
                <Row gutter={15} type="flex" justify="start">
                    <Col {...formLayout}>
                        <Row>
                            <Col span={14}>
                                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="日期范围">
                                    {getFieldDecorator('StartDt', {
                                        initialValue: moment().subtract(1, 'months'),
                                        rules: [{ required: true, message: '请选择开始时间' }]
                                    })(
                                        <DatePicker disabledDate={(startValue) => {
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
                                    {getFieldDecorator('EndDt', {
                                        initialValue: moment(),
                                        rules: [{ required: true, message: '请选择结束时间' }]
                                    })(
                                        <DatePicker disabledDate={(endValue) => {
                                            const startValue = getFieldValue('StartDt');
                                            if (!endValue || !startValue) {
                                                return false;
                                            }
                                            if (endValue > moment()) {
                                                return true;
                                            }
                                            return endValue.isBefore(startValue, 'day');
                                        }} />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>

                    <Col {...formOptLayout} className='text-right' >
                        <FormItem label=''>
                            <Button onClick={this.handleReset}>重置</Button>
                            <Button type='primary' htmlType='submit' className='ml-8'>查询</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    }
}

SearchForm = Form.create({
    mapPropsToFields: props => {
        const { view: { searchValue } } = props.inWorkDaysByCycleSelectStore;
        return createFormField(searchValue);
    },
    onValuesChange: (props, changedValues, allValues) => {
        props.inWorkDaysByCycleSelectStore.handleFormValuesChange(allValues);
    }
})(SearchForm);

export default SearchForm;