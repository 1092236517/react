import { formItemLayout, formLayout, getFormOptLayout, createFormField } from 'ADMIN_UTILS/searchFormUtil';
import { Button, Col, Form, Input, Row, Select, DatePicker } from 'antd';
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
            window._czc.push(['_trackEvent', '应发未发列表', '查询', '应发未发列表_Y结算']);
        });
    }

    render() {
        const { form } = this.props;
        const { getFieldDecorator, getFieldValue } = form;
        const { laborList, companyList } = this.props;
        const formOptLayout = getFormOptLayout(8);

        return (
            <Form onSubmit={this.handleFormSubmit}>
                <Row gutter={15}>
                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label="选择企业">
                            {getFieldDecorator('EntId')(
                                <Select showSearch
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
                        <FormItem {...formItemLayout} label="选择劳务">
                            {getFieldDecorator('TrgtSpId')(
                                <Select showSearch
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
                        <FormItem {...formItemLayout} label="身份证号码">
                            {getFieldDecorator('IdCardNum')(<Input placeholder="请输入" maxLength={18} />)}
                        </FormItem>
                    </Col>

                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label="姓名">
                            {getFieldDecorator('RealName')(<Input placeholder="请输入" />)}
                        </FormItem>
                    </Col>
                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label="预检测结果">
                            {getFieldDecorator('PreChekInfo')(
                                <Select placeholder="请选择">
                                    <Option value={-9999}>全部</Option>
                                    <Option value={1}>名单中无工号</Option>
                                    <Option value={2}>工号不一致</Option>
                                    <Option value={3}>没有有效的银行卡</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label="薪资类型">
                            {getFieldDecorator('SalaryTyp')(
                                <Select placeholder="请选择">
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
                        <FormItem {...formItemLayout} label="补发状态">
                            {getFieldDecorator('ReissueSts')(
                                <Select placeholder="请选择">
                                    <Option value={-9999}>全部</Option>
                                    <Option value={1}>未处理</Option>
                                    <Option value={2}>已处理</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col {...formLayout}>
                        <Row>
                            <Col span={14}>
                                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="发薪月份">
                                    {getFieldDecorator('BeginDt')(<MonthPicker format="YYYY-MM" style={{ width: '100%' }}
                                        disabledDate={(startValue) => {
                                            const endValue = getFieldValue('EndDt');
                                            if (!startValue || !endValue) {
                                                return false;
                                            }
                                            return startValue.isAfter(endValue, 'day');
                                        }} />)}
                                </FormItem>
                            </Col>
                            <Col span={10}>
                                <FormItem labelCol={{ span: 1 }} wrapperCol={{ span: 23 }} label="-" colon={false}>
                                    {getFieldDecorator('EndDt')(<MonthPicker format="YYYY-MM" style={{ width: '100%' }}
                                        disabledDate={(endValue) => {
                                            const startValue = getFieldValue('BeginDt');
                                            if (!endValue || !startValue) {
                                                return false;
                                            }
                                            return endValue.isBefore(startValue, 'day');
                                        }} />)}
                                </FormItem>
                            </Col>
                        </Row>
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