import React, { Component } from 'react';
import { observer } from "mobx-react";
import { Form, Row, Col, Input, DatePicker, Button, Select, message, Tag } from 'antd';
import { getFormOptLayout, formItemLayout, formLayout, createFormField } from 'ADMIN_UTILS/searchFormUtil';
import { selectInputSearch } from 'ADMIN_UTILS';
import moment from 'moment';

const FormItem = Form.Item;
const { Option } = Select;

@observer
class SearchForm extends Component {
    startQuery = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }

            const { BeginDt, EndDt, TrgtSpId, EntId } = fieldsValue;
            if (!TrgtSpId && !EntId) {
                message.error('请选择企业或劳务');
                return;
            }
            if (BeginDt.clone().add(120, 'day').isBefore(EndDt)) {
                message.error('时间跨度不可跨度120天！');
                return;
            }

            const { startQuery } = this.props;
            startQuery();
            window._czc.push(['_trackEvent', '报到率入职率', '查询', '报到率入职率_N非结算']);
        });
    }

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const formOptLayout = getFormOptLayout(4);
        const { companyList, laborList, resetForm } = this.props;

        return (
            <Form onSubmit={this.startQuery}>
                <Row gutter={15} type="flex" justify="start">
                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='劳务'>
                            {getFieldDecorator('TrgtSpId', {
                                // rules: [{ required: true, message: '请选择劳务' }]
                            })(
                                <Select
                                    allowClear={true}
                                    placeholder='请选择'
                                    filterOption={selectInputSearch}
                                    optionFilterProp="children"
                                    showSearch>
                                    {
                                        laborList.map((value) => {
                                            return <Option key={value.SpId} value={value.SpId}>{value.SpShortName}</Option>;
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>

                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='企业'>
                            {getFieldDecorator('EntId', {
                                // rules: [{ required: true, message: '请选择企业' }]
                            })(
                                <Select
                                    allowClear={true}
                                    placeholder='请选择'
                                    filterOption={selectInputSearch}
                                    optionFilterProp="children"
                                    showSearch>
                                    {
                                        companyList.map((value) => {
                                            return <Option key={value.EntId} value={value.EntId}>{value.EntShortName}</Option>;
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>

                    <Col {...formLayout}>
                        <Row>
                            <Col span={14}>
                                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="面试日期">
                                    {getFieldDecorator('BeginDt', {
                                        rules: [{ required: true, message: '请选择开始时间' }]
                                    })(
                                        <DatePicker disabledDate={(startValue) => {
                                            const endValue = getFieldValue('EndDt');
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
                                    {getFieldDecorator('EndDt', {
                                        rules: [{ required: true, message: '请选择结束时间' }]
                                    })(
                                        <DatePicker disabledDate={(endValue) => {
                                            const startValue = getFieldValue('BeginDt');
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
                        <FormItem {...formItemLayout} label='留存天数'>
                            {getFieldDecorator('Days', {
                                rules: [{ required: true, message: '请选择天数' }]
                            })(
                                <Select
                                    className='w-100'
                                    mode='multiple'>
                                    {
                                        Array(120).fill(0).map((v, i) => <Option key={i + 1} value={i + 1}>{i + 1}</Option>)
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>

                    <Col {...formOptLayout} className="text-right">
                        <FormItem>
                            <Button onClick={resetForm}>重置</Button>
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
    onValuesChange: (props, changedValues, allValues) => props.handleFormValuesChange(changedValues, allValues)
})(SearchForm);

export default SearchForm;