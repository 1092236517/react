import React, { Component } from 'react';
import { Form, Row, Col, Button, Select, Input, DatePicker } from 'antd';
import { formItemLayout, formLayout, createFormField, getFormOptLayout } from 'ADMIN_UTILS/searchFormUtil';
import { observer } from "mobx-react";
import { selectInputSearch } from 'ADMIN_UTILS';
import moment from 'moment';
const FormItem = Form.Item;
const Option = Select.Option;

@observer
class SearchForm extends Component {
    importPreview = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err) => {
            if (err) {
                return;
            }

            const { startQuery, resetPageCurrent } = this.props;
            resetPageCurrent();
            startQuery();
            window._czc.push(['_trackEvent', '会员申请表', '查询', '会员申请表_N非结算']);
        });
    }

    render() {
        const { form: { getFieldDecorator, getFieldValue } } = this.props;
        const { companyList, laborList, resetForm } = this.props;
        const formOptLayout = getFormOptLayout(4);

        return (
            <Form onSubmit={this.importPreview}>
                <Row gutter={15} type="flex" justify="start">
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
                                        companyList.map((value) => <Option key={value.EntId} value={value.EntId}>{value.EntShortName}</Option>)
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
                                        laborList.map((value) => <Option key={value.SpId} value={value.SpId}>{value.SpShortName}</Option>)
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>

                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='姓名'>
                            {getFieldDecorator('RealName')(
                                <Input maxLength={10} placeholder='请输入' />
                            )}
                        </FormItem>
                    </Col>

                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='身份证号码'>
                            {getFieldDecorator('IdCardNum', {
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
                        <FormItem {...formItemLayout} label='工号'>
                            {getFieldDecorator('WorkCardNo')(
                                <Input maxLength={18} placeholder='请输入' />
                            )}
                        </FormItem>
                    </Col>

                    <Col {...formLayout}>
                        <Row>
                            <Col span={14}>
                                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="申请日期">
                                    {getFieldDecorator('ApplyStartDt')(
                                        <DatePicker
                                            disabledDate={(startValue) => {
                                                const endValue = getFieldValue('ApplyEndDt');
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
                                    {getFieldDecorator('ApplyEndDt')(
                                        <DatePicker
                                            disabledDate={(endValue) => {
                                                const startValue = getFieldValue('ApplyStartDt');
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
                                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="返费结束日期">
                                    {getFieldDecorator('FfEndDtStart')(
                                        <DatePicker
                                            disabledDate={(startValue) => {
                                                const endValue = getFieldValue('FfEndDtEnd');
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
                                    {getFieldDecorator('FfEndDtEnd')(
                                        <DatePicker
                                            disabledDate={(endValue) => {
                                                const startValue = getFieldValue('FfEndDtStart');
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
                        <FormItem {...formItemLayout} label='结算模式'>
                            {getFieldDecorator('SettlementTyp')(
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
                        <FormItem {...formItemLayout} label='是否劳务打款'>
                            {getFieldDecorator('HasReturnFee')(
                                <Select>
                                    <Option value={-9999}>全部</Option>
                                    <Option value={1}>劳务返费</Option>
                                    <Option value={2}>平台返费</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>

                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='是否已发劳务'>
                            {getFieldDecorator('IsSendSp')(
                                <Select>
                                    <Option value={-9999}>全部</Option>
                                    <Option value={1}>未发</Option>
                                    <Option value={2}>已发</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>

                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='付款状态'>
                            {getFieldDecorator('TransferResult')(
                                <Select>
                                    <Option value={-9999}>全部</Option>
                                    <Option value={1}>未打款</Option>
                                    <Option value={2}>已打款</Option>
                                    <Option value={3}>拒绝打款</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>

                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='审核状态'>
                            {getFieldDecorator('AuditSts')(
                                <Select>
                                    <Option value={-9999}>全部</Option>
                                    <Option value={1}>待审核</Option>
                                    <Option value={2}>通过</Option>
                                    <Option value={3}>已作废</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>

                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='返费是否扣税'>
                            {getFieldDecorator('ReturnFeeIsTax')(
                                <Select>
                                    <Option value={-9999}>全部</Option>
                                    <Option value={1}>否</Option>
                                    <Option value={2}>是</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col {...formLayout}>
                        <Form.Item label="在职状态" {...formItemLayout}>
                            {getFieldDecorator('WorkSts')(
                                <Select placeholder="请选择">
                                    <Select.Option value={-9999}>全部</Select.Option>
                                    <Select.Option value={1}>在职</Select.Option>
                                    <Select.Option value={3}>转正</Select.Option>
                                    <Select.Option value={4}>未入职</Select.Option>
                                    <Select.Option value={2}>离职</Select.Option>
                                    <Select.Option value={5}>未知</Select.Option>
                                    <Select.Option value={6}>自离</Select.Option>
                                </Select>
                            )}
                        </Form.Item>
                    </Col>
                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='有无入职日期'>
                            {getFieldDecorator('IsHasEntryDt')(
                                <Select>
                                    <Option value={-9999}>全部</Option>
                                    <Option value={1}>无</Option>
                                    <Option value={2}>有</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>

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
    onValuesChange: (props, changedValues, allValues) => (props.handleFormValuesChange(allValues))
})(SearchForm);

export default SearchForm;