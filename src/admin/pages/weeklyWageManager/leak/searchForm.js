import React, { Component } from 'react';
import { observer } from "mobx-react";
import { Form, Row, Col, Input, DatePicker, Button, Select } from 'antd';
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

            const { startQuery, resetPageCurrent } = this.props.weeklyWageLeakStore;
            resetPageCurrent();
            startQuery();
            window._czc.push(['_trackEvent', '周薪查漏', '查询', '周薪查漏_Y结算']);
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

    upDateSettleDate = (which, date) => {
        if (date == null) {
            return;
        }
        let dateC = date.clone();
        if (which == 'start') {
            dateC.add(6, 'days');
            this.props.form.setFieldsValue({
                EndDt: dateC
            });
        } else {
            dateC.subtract(6, 'days');
            this.props.form.setFieldsValue({
                BeginDt: dateC
            });
        }
    }

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const formOptLayout = getFormOptLayout(7);
        const { agentList, companyList, laborList } = this.props.globalStore;

        return (
            <Form onSubmit={this.startQuery}>
                <Row gutter={15} type="flex" justify="start">
                    <Col {...formLayout}>
                        <Row>
                            <Col span={14}>
                                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="发薪周期">
                                    {getFieldDecorator('BeginDt', {
                                        initialValue: moment().subtract(moment().day() + 7 + (moment().day() < 1 ? 7 : 0), 'days')
                                    })(
                                        <DatePicker
                                            allowClear={false}
                                            onChange={this.upDateSettleDate.bind(this, 'start')}
                                            disabledDate={(currentDate) => (currentDate && currentDate.day() != 0 || currentDate.isAfter(moment().subtract(moment().day() + 7 + (moment().day() < 1 ? 7 : 0), 'days'), 'days'))} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={10}>
                                <FormItem labelCol={{ span: 1 }} wrapperCol={{ span: 23 }} label="-">
                                    {getFieldDecorator('EndDt', {
                                        initialValue: moment().subtract(moment().day() - 6 + 7 + (moment().day() < 1 ? 7 : 0), 'days')
                                    })(
                                        <DatePicker
                                            allowClear={false}
                                            onChange={this.upDateSettleDate.bind(this, 'end')}
                                            disabledDate={(currentDate) => (currentDate && currentDate.day() != 6 || currentDate.isAfter(moment().subtract(moment().day() - 6 + 7 + (moment().day() < 1 ? 7 : 0), 'days'), 'days'))} />
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
                            {getFieldDecorator('Name', {
                                initialValue: ''
                            })(
                                <Input maxLength={10} placeholder='请输入' />
                            )}
                        </FormItem>
                    </Col>

                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='处理状态'>
                            {getFieldDecorator('OperationSts', {
                                initialValue: -9999
                            })(
                                <Select>
                                    <Option value={-9999}>全部</Option>
                                    <Option value={1}>未处理</Option>
                                    <Option value={2}>处理正常</Option>
                                    <Option value={3}>处理异常</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>

                    <Col {...formOptLayout} className="text-right">
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
    mapPropsToFields: props => {
        const { view: { searchValue } } = props.weeklyWageLeakStore;
        return createFormField(searchValue);
    },
    onValuesChange: (props, changedValues, allValues) => {
        props.weeklyWageLeakStore.handleFormValuesChange(allValues);
    }
})(SearchForm);

export default SearchForm;