import React, { Component } from 'react';
import { observer } from "mobx-react";
import { Form, Row, Col, Input, DatePicker, Button, Select } from 'antd';
import { formItemLayout, formLayout, getFormOptLayout, createFormField } from 'ADMIN_UTILS/searchFormUtil';
import { selectInputSearch } from 'ADMIN_UTILS';

const FormItem = Form.Item;
const Option = Select.Option;
const { MonthPicker } = DatePicker;
@observer
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
            window._czc.push(['_trackEvent', '月薪查询', '查询', '月薪查询_Y结算']);
        });
    }

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { agentList, companyList, laborList, handleFormReset } = this.props;
        const formOptLayout = getFormOptLayout(16);

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
                        <Row>
                            <Col span={14}>
                                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="账单审核日期">
                                    {getFieldDecorator('AuditBeginDt')(
                                        <DatePicker
                                            disabledDate={(startValue) => {
                                                const endValue = getFieldValue('AuditEndDt');
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
                                    {getFieldDecorator('AuditEndDt')(
                                        <DatePicker
                                            disabledDate={(endValue) => {
                                                const startValue = getFieldValue('AuditBeginDt');
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
                                initialValue: '',
                                rules: [{ pattern: /^\d+$/, message: '请输入正确的批次号' }]
                            })(
                                <Input maxLength={15} placeholder='请输入' />
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
                        <FormItem {...formItemLayout} label='审核状态'>
                            {getFieldDecorator('TrgtSpAuditSts', {
                                initialValue: -9999
                            })(
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
                        <FormItem {...formItemLayout} label='模式'>
                            {getFieldDecorator('SettlementTyp', {
                                initialValue: -9999
                            })(
                                <Select>
                                    <Option value={-9999}>全部</Option>
                                    <Option value={1}>ZX</Option>
                                    <Option value={2}>Z</Option>
                                    <Option value={3}>ZA</Option>
                                    <Option value={4}>Z-B</Option>
                                    <Option value={5}>ZX-B</Option>
                                    <Option value={6}>ZX-A</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col {...formLayout}>
                        <Form.Item label="用工模式" {...formItemLayout}>
                            {getFieldDecorator('EmploymentTyp')(
                                <Select placeholder="请选择">
                                    <Select.Option value={-9999}>全部模式</Select.Option>
                                    <Select.Option value={1}>劳务用工</Select.Option>
                                    <Select.Option value={2}>灵活用工爱员工</Select.Option>
                                </Select>
                            )}
                        </Form.Item>
                    </Col>

                    <Col {...formLayout}>
                        <Form.Item label="是否劳务发放" {...formItemLayout}>
                            {getFieldDecorator('MonthSalaryPayer')(
                                <Select placeholder="请选择">
                                    <Select.Option value={-9999}>全部</Select.Option>
                                    <Select.Option value={2}>是</Select.Option>
                                    <Select.Option value={1}>否</Select.Option>
                                </Select>
                            )}
                        </Form.Item>
                    </Col>

                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='工种'>
                            {getFieldDecorator('JffSpEntName')(
                                <Input maxLength={50} placeholder='请输入' />
                            )}
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
    mapPropsToFields: props => {
        return createFormField(props.searchValue);
    },
    onValuesChange: (props, changedValues, allValues) => {
        props.handleFormValuesChange(allValues);
    }
})(SearchForm);

export default SearchForm;