import React, { Component } from 'react';
import { observer } from "mobx-react";
import { Form, Row, Col, Input, DatePicker, Button, Select } from 'antd';
import { getFormOptLayout, formItemLayout, formLayout, createFormField } from 'ADMIN_UTILS/searchFormUtil';

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

            const { startQuery, resetPageCurrent, setSelectRowKeys } = this.props;
            setSelectRowKeys([]);
            resetPageCurrent();
            startQuery();
            window._czc.push(['_trackEvent', '发薪', '查询', '发薪_Y结算']);
        });
    }

    render() {
        const formOptLayout = getFormOptLayout(15);
        const {
            form: {
                getFieldDecorator,
                getFieldValue
            },
            searchValue: {
                TradeType
            },
            companyList,
            laborList,
            handleFormReset
        } = this.props;

        return (
            <Form onSubmit={this.startQuery}>
                <Row gutter={15} type="flex" justify="start">
                    <Col {...formLayout}>
                        <Row>
                            <Col span={14}>
                                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="发薪周期">
                                    {getFieldDecorator('BeginDate')(
                                        <DatePicker
                                            disabled={TradeType === 7 || TradeType === 8}
                                            disabledDate={(startValue) => {
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
                                        <DatePicker
                                            disabled={TradeType === 7 || TradeType === 8}
                                            disabledDate={(endValue) => {
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
                        <Row>
                            <Col span={14}>
                                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="归属月份">
                                    {getFieldDecorator('StartMonth')(
                                        <MonthPicker disabledDate={(startValue) => {
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
                                        <MonthPicker disabledDate={(endValue) => {
                                            const startValue = getFieldValue('StartMonth');
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
                                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="打款时间">
                                    {getFieldDecorator('WithdrawTimeS')(
                                        <DatePicker disabledDate={(startValue) => {
                                            const endValue = getFieldValue('WithdrawTimeE');
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
                                    {getFieldDecorator('WithdrawTimeE')(
                                        <DatePicker disabledDate={(endValue) => {
                                            const startValue = getFieldValue('WithdrawTimeS');
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
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
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
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
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
                        <FormItem {...formItemLayout} label='批次号'>
                            {getFieldDecorator('BatchID', {
                                initialValue: '',
                                rules: [{ pattern: /^\d+$/, message: '请输入正确的批次号' }]
                            })(
                                <Input placeholder='请输入' maxLength={15} />
                            )}
                        </FormItem>
                    </Col>

                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='姓名'>
                            {getFieldDecorator('RealName')(
                                <Input placeholder='请输入' maxLength={30} />
                            )}
                        </FormItem>
                    </Col>

                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='对方身份证号'>
                            {getFieldDecorator('IDCardNum', {
                                rules: [{
                                    pattern: /(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
                                    message: '请输入正确的18位身份证号'
                                }]
                            })(
                                <Input placeholder='请输入' maxLength={18} />
                            )}
                        </FormItem>
                    </Col>

                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='打款类型'>
                            {getFieldDecorator('TradeType')(
                                <Select>
                                    <Option value={-9999}>全部</Option>
                                    <Option value={1}>周薪</Option>
                                    <Option value={2}>月薪</Option>
                                    <Option value={7}>返费</Option>
                                    {/* <Option value={3}>中介费</Option> */}
                                    <Option value={4}>周薪重发</Option>
                                    <Option value={5}>月薪重发</Option>
                                    {/* <Option value={6}>中介费重发</Option> */}
                                    <Option value={8}>返费重发</Option>
                                    <Option value={9}>周返费</Option>
                                    <Option value={10}>周返费重发</Option>
                                </Select>
                            )}

                        </FormItem>
                    </Col>

                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='来源'>
                            {getFieldDecorator('BatchSrc')(
                                <Select>
                                    <Option value={-9999}>全部</Option>
                                    <Option value={1}>批量导入</Option>
                                    <Option value={2}>手工导入</Option>
                                </Select>
                            )}

                        </FormItem>
                    </Col>

                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='授权状态'>
                            {getFieldDecorator('AuditState')(
                                <Select>
                                    <Option value={-9999}>全部</Option>
                                    <Option value={1}>待审核</Option>
                                    <Option value={2}>通过</Option>
                                    <Option value={3}>未通过</Option>
                                </Select>
                            )}

                        </FormItem>
                    </Col>

                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='打款状态'>
                            {getFieldDecorator('WithdrawState')(
                                <Select>
                                    <Option value={-9999}>全部</Option>
                                    <Option value={1}>未打款</Option>
                                    <Option value={2}>打款中</Option>
                                    <Option value={3}>已打款</Option>
                                    <Option value={4}>打款失败</Option>
                                    <Option value={10}>劳务打款</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>

                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='到账状态'>
                            {getFieldDecorator('ToState')(
                                <Select>
                                    <Option value={-9999}>全部</Option>
                                    <Option value={1}>未到账</Option>
                                    <Option value={2}>到账成功</Option>
                                    <Option value={3}>到账失败</Option>
                                </Select>
                            )}
                        </FormItem>
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

                    <Col {...formOptLayout} className='text-right'>
                        <FormItem>
                            <Button onClick={handleFormReset}>重置</Button>
                            <Button type='primary' htmlType='submit' className='ml-8'>查询</Button>
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