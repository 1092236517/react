import { formItemLayout, createFormField, getFormOptLayout, formLayout } from 'ADMIN_UTILS/searchFormUtil';
import { Button, Col, DatePicker, Form, Row, Select, Input } from 'antd';
import { observer } from 'mobx-react';
import React from 'react';

const FormItem = Form.Item;
const Option = Select.Option;
const { MonthPicker } = DatePicker;
@observer
class SearchForm extends React.Component {
    handleFormReset = () => {
        this.props.handleFormReset();
    }

    handleFormSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err) => {
            if (err) return;
            this.props.resetPageCurrent();
            this.props.handleFormSubmit();
            window._czc.push(['_trackEvent', '工资单查询', '查询', '工资单查询_Y结算']);
        });
    }

    render() {
        const { form } = this.props;
        const { getFieldDecorator, getFieldValue } = form;
        const { companyList, laborList } = this.props;
        const formOptLayout = getFormOptLayout(5);
        return (
            <Form onSubmit={this.handleFormSubmit}>
                <Row gutter={12} >
                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='姓名'>
                            {getFieldDecorator('RealName')(
                                <Input autoComplete="off" maxLength={100} placeholder='请填写姓名' />
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
                                <Input autoComplete="off" placeholder='请填写身份证号码' maxLength={18} />
                            )}
                        </FormItem>
                    </Col>
                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='工号'>
                            {getFieldDecorator('WorkCardNo')(
                                <Input autoComplete="off" maxLength={100} placeholder='请填写姓名' />
                            )}
                        </FormItem>
                    </Col>

                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label="选择劳务">
                            {getFieldDecorator('TrgtSpId')(
                                <Select
                                    showSearch
                                    allowClear={true}
                                    placeholder="请选择"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {
                                        laborList.length > 0 ? laborList.map((item, index) => {
                                            return (
                                                <Option key={index} value={item.SpId}>{item.SpShortName}</Option>
                                            );
                                        }) : null
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label="选择企业">
                            {getFieldDecorator('EntId')(
                                <Select
                                    showSearch
                                    allowClear={true}
                                    placeholder="请选择"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {
                                        companyList.length > 0 ? companyList.map((item, index) => {
                                            return (
                                                <Option key={index} value={item.EntId}>{item.EntShortName}</Option>
                                            );
                                        }) : null
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label="审核结果">
                            {getFieldDecorator('AuditSts')(
                                <Select placeholder='请选择审核状态'>
                                    <Option value={-9999}>全部</Option>
                                    <Option value={1}>未审核</Option>
                                    <Option value={2}>通过</Option>
                                    <Option value={3}>未通过</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col {...formLayout}>
                        <Row>
                            <Col span={14}>
                                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="选择月份">
                                    {getFieldDecorator('MonthStart')(
                                        <MonthPicker
                                            format="YYYY-MM"
                                            style={{ width: '100%' }}
                                            disabledDate={(startValue) => {
                                                const endValue = getFieldValue('MonthEnd');
                                                if (!startValue || !endValue) {
                                                    return false;
                                                }
                                                return startValue.isAfter(endValue, 'day');
                                            }} />)
                                    }
                                </FormItem>
                            </Col>
                            <Col span={10}>
                                <FormItem labelCol={{ span: 1 }} wrapperCol={{ span: 23 }} label="-" colon={false}>
                                    {getFieldDecorator('MonthEnd')(
                                        <MonthPicker
                                            format="YYYY-MM"
                                            style={{ width: '100%' }}
                                            disabledDate={(endValue) => {
                                                const startValue = getFieldValue('MonthStart');
                                                if (!endValue || !startValue) {
                                                    return false;
                                                }
                                                return endValue.isBefore(startValue, 'day');
                                            }} />)
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>
                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label="作废状态">
                            {getFieldDecorator('IsValid')(
                                <Select placeholder='请选择'>
                                    <Option value={-9999}>全部</Option>
                                    <Option value={1}>未作废</Option>
                                    <Option value={2}>已作废</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label="是否有月薪审核">
                            {getFieldDecorator('MonthBillState')(
                                <Select placeholder='请选择'>
                                    <Option value={1}>全部</Option>
                                    <Option value={2}>是</Option>
                                    <Option value={3}>否</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col {...formOptLayout} className='text-right'>
                        <FormItem>
                            <Button onClick={this.handleFormReset}>重置</Button>
                            <Button className="ml-8" type="primary" htmlType="submit">查询</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>

        );
    }
}

export default Form.create({
    mapPropsToFields: props => createFormField(props.searchValue),
    onValuesChange: (props, changeValues, allValues) => props.onValuesChange(allValues)
})(SearchForm);