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
            const { EntId, EntryDtEnd, EntryDtStart, IntvDtEnd, IntvDtStart, OrderDtEnd, OrderDtStart, SettlementTyp, TrgtSpId } = fieldsValue;
            if (!EntId && !EntryDtEnd && !EntryDtStart && !IntvDtEnd && !IntvDtStart && !OrderDtEnd && !OrderDtStart && !SettlementTyp && !TrgtSpId) {
                message.error('至少选择一个过滤条件');
                return false;
            }
            const { startQuery, resetPageCurrent } = this.props;
            resetPageCurrent();
            startQuery();
            window._czc.push(['_trackEvent', 'zx盈利分析明细表', '查询', 'zx盈利分析明细表_N非结算']);
        });
    }

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const formOptLayout = getFormOptLayout(2);
        const { companyList, laborList, resetForm, exportRecord, exportButContro } = this.props;

        return (
            <Form onSubmit={this.startQuery}>
                <Row gutter={15} type="flex" justify="start">
                    <Col {...formLayout}>
                        <Row>
                            <Col span={16}>
                                <FormItem labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} label="面试日期">
                                    {getFieldDecorator('IntvDtStart', {

                                    })(
                                        <DatePicker
                                            disabledDate={(currentDate) =>
                                                getFieldValue('IntvDtEnd') ? moment(currentDate).isAfter(moment(getFieldValue('IntvDtEnd')), 'days') : false
                                            }
                                        />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem labelCol={{ span: 1 }} wrapperCol={{ span: 23 }} label="-">
                                    {getFieldDecorator('IntvDtEnd', {

                                    })(
                                        <DatePicker disabledDate={(currentDate) =>
                                            getFieldValue('IntvDtStart') ? moment(currentDate).isBefore(moment(getFieldValue('IntvDtStart')), 'days') : false
                                        } />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>
                    <Col {...formLayout}>
                        <Row>
                            <Col span={16}>
                                <FormItem labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} label="入职日期">
                                    {getFieldDecorator('EntryDtStart', {

                                    })(
                                        <DatePicker disabledDate={(currentDate) =>
                                            getFieldValue('EntryDtEnd') ? moment(currentDate).isAfter(moment(getFieldValue('EntryDtEnd')), 'days') : false
                                        } />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem labelCol={{ span: 1 }} wrapperCol={{ span: 23 }} label="-">
                                    {getFieldDecorator('EntryDtEnd', {

                                    })(
                                        <DatePicker disabledDate={(currentDate) =>
                                            getFieldValue('EntryDtStart') ? moment(currentDate).isBefore(moment(getFieldValue('EntryDtStart')), 'days') : false
                                        } />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>
                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='企业'>
                            {getFieldDecorator('EntId', {

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
                        <FormItem {...formItemLayout} label='劳务'>
                            {getFieldDecorator('TrgtSpId', {

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
                        <FormItem {...formItemLayout} label='模式'>
                            {getFieldDecorator('SettlementTyp', {

                            })(
                                <Select
                                    allowClear={true}
                                    placeholder='请选择'
                                    filterOption={selectInputSearch}
                                    optionFilterProp="children"
                                    showSearch>
                                    <Option value={1}>ZX模式</Option>
                                    <Option value={5}>ZX-B模式</Option>
                                    <Option value={6}>ZX-A模式</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col {...formLayout}>
                        <Row>
                            <Col span={16}>
                                <FormItem labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} label="订单结束日期">
                                    {getFieldDecorator('OrderDtStart', {
                                    })(
                                        <DatePicker disabledDate={(currentDate) =>
                                            getFieldValue('OrderDtEnd') ? moment(currentDate).isAfter(moment(getFieldValue('OrderDtEnd')), 'days') : false
                                        } />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem labelCol={{ span: 1 }} wrapperCol={{ span: 23 }} label="-">
                                    {getFieldDecorator('OrderDtEnd', {
                                    })(
                                        <DatePicker disabledDate={(currentDate) =>
                                            getFieldValue('OrderDtStart') ? moment(currentDate).isBefore(moment(getFieldValue('OrderDtStart')), 'days') : false
                                        } />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>
                    <Col {...formOptLayout} className="text-right">
                        <FormItem>
                            <Button className='ml-8' type="primary" htmlType="submit" className="ml-8">确定</Button>
                            <Button className='ml-8' onClick={resetForm}>重置</Button>
                            <Button className='ml-8' type='primary' onClick={exportRecord} disabled={exportButContro}>导出</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    }
}

SearchForm = Form.create({
    mapPropsToFields: props => (createFormField(props.searchValue)),
    onValuesChange: (props, changedValues, allValues) => props.handleFormValuesChange(allValues)
})(SearchForm);

export default SearchForm;