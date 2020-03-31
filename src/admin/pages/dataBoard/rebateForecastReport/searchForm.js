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

            const { startQuery, resetPageCurrent } = this.props;
            resetPageCurrent();
            startQuery();
            window._czc.push(['_trackEvent', '返费预测表', '查询', '返费预测表_N非结算']);
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
                                        <DatePicker
                                            disabledDate={(currentDate) =>
                                                getFieldValue('IntvDtStart') ? moment(currentDate).isBefore(moment(getFieldValue('IntvDtStart')), 'days') : false
                                            }
                                        />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>

                    </Col>

                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label="会员姓名">
                            {getFieldDecorator('RealName')(<Input placeholder='请输入' maxLength={10} />)}
                        </FormItem>
                    </Col>
                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label="身份证">
                            {getFieldDecorator('IdCardNum')(<Input placeholder='请输入' maxLength={18} />)}
                        </FormItem>
                    </Col>
                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='补贴类型'>
                            {getFieldDecorator('HasReturnFee', {

                            })(
                                <Select
                                    allowClear={true}
                                    placeholder='请选择'
                                    filterOption={selectInputSearch}
                                    optionFilterProp="children"
                                    showSearch>
                                    <Option value={1}>劳务返费</Option>
                                    <Option value={2}>平台返费</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='在离职状态'>
                            {getFieldDecorator('WorkSts', {

                            })(
                                <Select
                                    allowClear={true}
                                    placeholder='请选择'
                                    filterOption={selectInputSearch}
                                    optionFilterProp="children"
                                    showSearch>
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
                        <Row>
                            <Col span={16}>
                                <FormItem labelCol={{ span: 12 }} wrapperCol={{ span: 12 }} label="返费日期">
                                    {getFieldDecorator('FfEndDtStart', {

                                    })(
                                        <DatePicker
                                            disabledDate={(currentDate) =>
                                                getFieldValue('FfEndDtEnd') ? moment(currentDate).isAfter(moment(getFieldValue('FfEndDtEnd')), 'days') : false
                                            }
                                        />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={8}>
                                <FormItem labelCol={{ span: 1 }} wrapperCol={{ span: 23 }} label="-">
                                    {getFieldDecorator('FfEndDtEnd', {

                                    })(
                                        <DatePicker
                                            disabledDate={(currentDate) =>
                                                getFieldValue('FfEndDtStart') ? moment(currentDate).isBefore(moment(getFieldValue('FfEndDtStart')), 'days') : false
                                            }
                                        />
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
                    <Col {...formOptLayout} className="text-right">
                        <FormItem>
                            <Button className='ml-8' type="primary" htmlType="submit" className="ml-8">确定</Button>
                            <Button className='ml-8' onClick={resetForm}>重置</Button>
                            {/* <Button className='ml-8' type='primary' onClick={exportRecord}>导出</Button> */}
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