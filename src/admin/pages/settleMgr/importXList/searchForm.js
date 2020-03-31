import React, { Component } from 'react';
import { Form, Row, Col, Button, Select, DatePicker, Input } from 'antd';
import { formItemLayout, formLayout, getFormOptLayout, createFormField } from 'ADMIN_UTILS/searchFormUtil';
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
            window._czc.push(['_trackEvent', '导入X查询/审核', '查询', '导入X查询/审核_Y结算']);
        });
    }

    handleReset = (e) => {
        const { resetForm } = this.props;
        resetForm();
    }

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const formOptLayout = getFormOptLayout(11);
        const { companyList, laborList } = this.props;

        return (
            <Form onSubmit={this.startQuery}>
                <Row gutter={15} type="flex" justify="start">
                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='劳务'>
                            {getFieldDecorator('LaborID')(
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
                            {getFieldDecorator('EnterpriseID')(
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
                                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="月份">
                                    {getFieldDecorator('BeginMonth')(
                                        <MonthPicker
                                            disabledDate={(startValue) => {
                                                const endValue = getFieldValue('EndMonth');
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
                                    {getFieldDecorator('EndMonth')(
                                        <MonthPicker
                                            disabledDate={(endValue) => {
                                                const startValue = getFieldValue('BeginMonth');
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
                        <FormItem {...formItemLayout} label='X类型'>
                            {getFieldDecorator('XType', {
                                initialValue: -9999
                            })(
                                <Select>
                                    <Option value={-9999}>全部</Option>
                                    <Option value={1}>X-工资</Option>
                                    <Option value={2}>X-社保</Option>
                                    <Option value={3}>X-管理费</Option>
                                    <Option value={4}>X-招聘费</Option>
                                    <Option value={5}>X-自离工资</Option>
                                    <Option value={6}>X-其他</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>


                    <Col {...formLayout}>
                        <Row>
                            <Col span={14}>
                                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="导入日期">
                                    {getFieldDecorator('BeginImportDate')(
                                        <DatePicker
                                            disabledDate={(startValue) => {
                                                const endValue = getFieldValue('EndImportDate');
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
                                    {getFieldDecorator('EndImportDate')(
                                        <DatePicker
                                            disabledDate={(endValue) => {
                                                const startValue = getFieldValue('BeginImportDate');
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
                        <FormItem {...formItemLayout} label='预检测结果'>
                            {getFieldDecorator('IsOK', {
                                initialValue: -9999
                            })(
                                <Select>
                                    <Option value={-9999}>全部</Option>
                                    <Option value={1}>正常</Option>
                                    <Option value={2}>不正常</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>


                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='审核状态'>
                            {getFieldDecorator('AuditStatus', {
                                initialValue: -9999
                            })(
                                <Select>
                                    <Option value={-9999}>全部</Option>
                                    <Option value={1}>未审核</Option>
                                    <Option value={2}>审核通过</Option>
                                    <Option value={3}>审核不通过</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>

                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='身份证号码'>
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
                        <FormItem {...formItemLayout} label='姓名'>
                            {getFieldDecorator('RealName', {
                                initialValue: ''
                            })(
                                <Input maxLength={10} placeholder='请输入' />
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
                                    <Option value={4}>未处理</Option>
                                    <Option value={5}>未知</Option>
                                    <Option value={6}>自离</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>

                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='结算模式'>
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

                    <Col {...formOptLayout} className='text-right'>
                        <FormItem>
                            <Button onClick={this.handleReset}>重置</Button>
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
    onValuesChange: (props, changedValues, allValues) => {
        props.handleFormValuesChange(allValues);
    }
})(SearchForm);

export default SearchForm;