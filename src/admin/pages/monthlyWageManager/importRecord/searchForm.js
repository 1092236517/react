import React, { Component } from 'react';
import { observer } from "mobx-react";
import { Form, Row, Col, Input, DatePicker, Button, Select } from 'antd';
import { getFormOptLayout, formItemLayout, formLayout, createFormField } from 'ADMIN_UTILS/searchFormUtil';
import { selectInputSearch } from 'ADMIN_UTILS';

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

            const { startQuery, resetPageCurrent } = this.props.monthlyWageImportRecordStore;
            resetPageCurrent();
            startQuery();
            window._czc.push(['_trackEvent', '导入月薪记录', '查询', '导入月薪记录_Y结算']);
        });
    }

    handleReset = (e) => {
        const { resetFields, setFieldsValue } = this.props.form;
        resetFields();
        // 手动清空，触发form的onValuesChange事件
        setFieldsValue({
            IdCardNum: ''
        });
    }

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const formOptLayout = getFormOptLayout(10);
        const { agentList, companyList, laborList } = this.props.globalStore;

        return (
            <Form onSubmit={this.startQuery}>
                <Row gutter={15} type="flex" justify="start">
                    <Col {...formLayout}>
                        <Row>
                            <Col span={14}>
                                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="归属月份">
                                    {getFieldDecorator('BillRelatedMoStart')(
                                        <MonthPicker
                                            disabledDate={(startValue) => {
                                                const endValue = getFieldValue('BillRelatedMoEnd');
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
                                    {getFieldDecorator('BillRelatedMoEnd')(
                                        <MonthPicker
                                            disabledDate={(endValue) => {
                                                const startValue = getFieldValue('BillRelatedMoStart');
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
                        <FormItem {...formItemLayout} label='中介'>
                            {getFieldDecorator('SrceSpId')(
                                <Select
                                    allowClear={true}
                                    placeholder='请选择'
                                    filterOption={selectInputSearch}
                                    optionFilterProp="children"
                                    showSearch>
                                    {
                                        agentList.map((value) => {
                                            return <Option key={value.SpId} value={value.SpId}>{value.SpShortName}</Option>;
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>

                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='身份证号码'>
                            {getFieldDecorator('IdCardNum', {
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
                        <FormItem {...formItemLayout} label='姓名'>
                            {getFieldDecorator('RealName', {
                                initialValue: ''
                            })(
                                <Input maxLength={10} placeholder='请输入' />
                            )}
                        </FormItem>
                    </Col>

                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='月薪类型'>
                            {getFieldDecorator('SalaryTyp', {
                                initialValue: -9999
                            })(
                                <Select placeholder='请选择'>
                                    <Option value={-9999}>全部</Option>
                                    <Option value={1}>工资</Option>
                                    <Option value={2}>社保</Option>
                                    <Option value={3}>补贴</Option>
                                    <Option value={4}>公积金</Option>
                                    <Option value={5}>其他</Option>
                                    <Option value={6}>补发</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>

                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='在职状态'>
                            {getFieldDecorator('WorkSts', {
                                initialValue: -9999
                            })(
                                <Select>
                                    <Option value={-9999}>全部</Option>
                                    <Option value={1}>在职</Option>
                                    <Option value={2}>离职</Option>
                                    <Option value={3}>转正</Option>
                                    <Option value={4}>未入职</Option>
                                    <Option value={5}>未知</Option>
                                    <Option value={6}>自离</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>

                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='录入类型'>
                            {getFieldDecorator('BillSrce', {
                                initialValue: -9999
                            })(
                                <Select>
                                    <Option value={-9999}>全部</Option>
                                    <Option value={1}>批量导入</Option>
                                    <Option value={2}>手动补发</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>

                    <Col {...formLayout}>
                        <Row>
                            <Col span={14}>
                                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="操作时间">
                                    {getFieldDecorator('UpdateTmStart')(
                                        <DatePicker disabledDate={(startValue) => {
                                            const endValue = getFieldValue('UpdateTmEnd');
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
                                    {getFieldDecorator('UpdateTmEnd')(
                                        <DatePicker disabledDate={(endValue) => {
                                            const startValue = getFieldValue('UpdateTmStart');
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
                        <FormItem {...formItemLayout} label='操作人'>
                            {getFieldDecorator('Operator', {
                                initialValue: ''
                            })(
                                <Input placeholder='请输入' />
                            )}
                        </FormItem>
                    </Col>

                    <Col {...formLayout} className='text-right' >
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
        const { view: { searchValue } } = props.monthlyWageImportRecordStore;
        return createFormField(searchValue);
    },
    onValuesChange: (props, changedValues, allValues) => {
        props.monthlyWageImportRecordStore.handleFormValuesChange(allValues);
    }
})(SearchForm);

export default SearchForm;
