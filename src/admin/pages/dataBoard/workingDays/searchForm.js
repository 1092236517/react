import { selectInputSearch } from 'ADMIN_UTILS';
import { createFormField, formItemLayout, formLayout, getFormOptLayout } from 'ADMIN_UTILS/searchFormUtil';
import { Button, Col, DatePicker, Form, Row, Select } from 'antd';
import { observer } from "mobx-react";
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

            const { startQuery, resetPageCurrent } = this.props.workingDaysStore;
            resetPageCurrent();
            startQuery();
            window._czc.push(['_trackEvent', '在职天数查询', '查询', '在职天数查询_N非结算']);
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
                                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="面试时间">
                                    {getFieldDecorator('IntvDtStart')(
                                        <DatePicker disabledDate={(startValue) => {
                                            const endValue = getFieldValue('IntvDtEnd');
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
                                    {getFieldDecorator('IntvDtEnd')(
                                        <DatePicker disabledDate={(endValue) => {
                                            const startValue = getFieldValue('IntvDtStart');
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
                    <Col {...formLayout}>
                        <Row>
                            <Col span={14}>
                                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="入职时间">
                                    {getFieldDecorator('EntryDtStart')(
                                        <DatePicker disabledDate={(startValue) => {
                                            const endValue = getFieldValue('EntryDtEnd');
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
                                    {getFieldDecorator('EntryDtEnd')(
                                        <DatePicker disabledDate={(endValue) => {
                                            const startValue = getFieldValue('EntryDtStart');
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
                    <Col {...formLayout}>
                        <Row>
                            <Col span={14}>
                                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="离职时间">
                                    {getFieldDecorator('LeaveDtStart')(
                                        <DatePicker disabledDate={(startValue) => {
                                            const endValue = getFieldValue('LeaveDtEnd');
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
                                    {getFieldDecorator('LeaveDtEnd')(
                                        <DatePicker disabledDate={(endValue) => {
                                            const startValue = getFieldValue('LeaveDtStart');
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
                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='劳务'>
                            {getFieldDecorator('TrgtSpId')(
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
                            {getFieldDecorator('EntId')(
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
        const { view: { searchValue } } = props.workingDaysStore;
        return createFormField(searchValue);
    },
    onValuesChange: (props, changedValues, allValues) => {
        props.workingDaysStore.handleFormValuesChange(allValues);
    }
})(SearchForm);

export default SearchForm;