import React, { Component } from 'react';
import { Form, Row, Col, DatePicker, Button, Select, Input } from 'antd';
import { getFormOptLayout, formItemLayout, formLayout, createFormField } from 'ADMIN_UTILS/searchFormUtil';
import { observer } from "mobx-react";
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

            const { startQuery, resetPageCurrent } = this.props;
            resetPageCurrent();
            startQuery();
            window._czc.push(['_trackEvent', '月薪账单', '查询', '月薪账单_Y结算']);
        });
    }

    render() {
        const {
            form: {
                getFieldDecorator, getFieldValue
            },
            laborList,
            companyList,
            resetForm
        } = this.props;
        const formOptLayout = getFormOptLayout(9);

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
                        <FormItem {...formItemLayout} label='批次号'>
                            {getFieldDecorator('BillMonthlyBatchId', {
                                rules: [{ pattern: /^\d+$/, message: '请填写正确的批次号' }]
                            })(
                                <Input placeholder='请输入' maxLength={15} />
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
                        <FormItem {...formItemLayout} label='账单审核'>
                            {getFieldDecorator('TrgtSpAuditSts')(
                                <Select>
                                    <Option value={-9999}>全部</Option>
                                    <Option value={1}>待审核</Option>
                                    <Option value={2}>通过</Option>
                                    <Option value={3}>不通过</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>

                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='录入类型'>
                            {getFieldDecorator('BillSrce')(
                                <Select>
                                    <Option value={-9999}>全部</Option>
                                    <Option value={1}>批量导入</Option>
                                    <Option value={2}>手动补发</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>

                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='月薪类型'>
                            {getFieldDecorator('SalaryTyp')(
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
                        <Form.Item label="是否劳务发放" {...formItemLayout}>
                            {getFieldDecorator('SalaryPayer')(
                                <Select placeholder="请选择">
                                    <Select.Option value={-9999}>全部</Select.Option>
                                    <Select.Option value={2}>是</Select.Option>
                                    <Select.Option value={1}>否</Select.Option>
                                </Select>
                            )}
                        </Form.Item>
                    </Col>

                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='操作人'>
                            {getFieldDecorator('Operator')(
                                <Input placeholder='请输入' maxLength={15} />
                            )}
                        </FormItem>
                    </Col>

                    <Col {...formOptLayout} className='text-right'>
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
    onValuesChange: (props, changedValues, allValues) => (props.handleFormValuesChange(allValues))
})(SearchForm);

export default SearchForm;