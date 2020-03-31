import React, { Component } from 'react';
import { observer } from "mobx-react";
import { Form, Row, Col, Input, DatePicker, Button, Select } from 'antd';
import { getFormOptLayout, formItemLayout, formLayout, createFormField } from 'ADMIN_UTILS/searchFormUtil';

const FormItem = Form.Item;
const Option = Select.Option;

@observer
class SearchForm extends Component {
    startQuery = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }

            const { startQuery, resetPageCurrent, setSelectRowKeys } = this.props.withdrawManagerBackStore;
            setSelectRowKeys([]);
            resetPageCurrent();
            startQuery();
            window._czc.push(['_trackEvent', '退回列表', '查询', '退回列表_Y结算']);
        });
    }

    handleReset = (e) => {
        const { resetFields, setFieldsValue } = this.props.form;
        resetFields();
        // 手动清空，触发form的onValuesChange事件
        setFieldsValue({
            RealName: ''
        });
    }

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const formOptLayout = getFormOptLayout(6);

        return (
            <Form onSubmit={this.startQuery}>
                <Row gutter={15} type="flex" justify="start">
                    <Col {...formLayout}>
                        <Row>
                            <Col span={14}>
                                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="退回时间">
                                    {getFieldDecorator('BeginDate')(
                                        <DatePicker disabledDate={(startValue) => {
                                            const endValue = getFieldValue('EndDate');
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
                                    {getFieldDecorator('EndDate')(
                                        <DatePicker disabledDate={(endValue) => {
                                            const startValue = getFieldValue('BeginDate');
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
                        <FormItem {...formItemLayout} label='批次号'>
                            {getFieldDecorator('BatchID', {
                                initialValue: '',
                                rules: [{ pattern: /^\d+$/, message: '请输入正确的批次号' }]
                            })(
                                <Input maxLength={15} placeholder='请输入' />
                            )}
                        </FormItem>
                    </Col>

                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='姓名'>
                            {getFieldDecorator('RealName', {
                                initialValue: ''
                            })(
                                <Input maxLength={30} placeholder='请输入' />
                            )}
                        </FormItem>
                    </Col>

                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='对方身份证号'>
                            {getFieldDecorator('IDCardNum', {
                                initialValue: '',
                                rules: [{
                                    pattern: /(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
                                    message: '请输入正确的18位身份证号'
                                }]
                            })(
                                <Input maxLength={18} placeholder='请输入' />
                            )}
                        </FormItem>
                    </Col>

                    <Col {...formLayout}>   
                        <FormItem {...formItemLayout} label='打款类别'>
                            {getFieldDecorator('TradeType', {
                                initialValue: -9999
                            })(
                                <Select>
                                    <Option value={-9999}>全部</Option>
                                    <Option value={1}>周薪</Option>
                                    <Option value={2}>月薪</Option>
                                    <Option value={4}>返费</Option>
                                    {/* <Option value={3}>中介费</Option> */}
                                    <Option value={5}>周返费</Option>
                                </Select>
                            )}

                        </FormItem>
                    </Col>

                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='重新申请状态'>
                            {getFieldDecorator('ReApplyState', {
                                initialValue: -9999
                            })(
                                <Select>
                                    <Option value={-9999}>全部</Option>
                                    <Option value={1}>待申请</Option>
                                    <Option value={2}>已申请</Option>
                                </Select>
                            )}

                        </FormItem>
                    </Col>

                    <Col {...formOptLayout} className='text-right'>
                        <FormItem>
                            <Button onClick={this.handleReset}>重置</Button>
                            <Button type='primary' className='ml-8' htmlType='submit'>查询</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    }
}

SearchForm = Form.create({
    mapPropsToFields: props => {
        const { view: { searchValue } } = props.withdrawManagerBackStore;
        return createFormField(searchValue);
    },
    onValuesChange: (props, changedValues, allValues) => {
        props.withdrawManagerBackStore.handleFormValuesChange(allValues);
    }
})(SearchForm);

export default SearchForm;