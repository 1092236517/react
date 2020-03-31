import { formItemLayout, formLayout, getFormOptLayout, createFormField } from 'ADMIN_UTILS/searchFormUtil';
import { Button, Col, DatePicker, Form, Input, Row, Select } from 'antd';
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
            window._czc.push(['_trackEvent', 'X查漏-个人', '查询', 'X查漏-个人_Y结算']);
        });
    }

    render() {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        const { companyList, laborList } = this.props;
        const FormOptLayout = getFormOptLayout(5);
        return (
            <Form onSubmit={this.handleFormSubmit}>
                <Row gutter={12}>
                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label="劳务名称">
                            {getFieldDecorator('LaborID', {
                                rules: [{
                                    required: true,
                                    message: "劳务必填"
                                }]
                            })(
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
                        <FormItem {...formItemLayout} label="企业名称">
                            {getFieldDecorator('EnterpriseID', {
                                rules: [{
                                    required: true,
                                    message: "企业必填"
                                }]
                            })(
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
                        <FormItem {...formItemLayout} label="月份">
                            {getFieldDecorator('Month', {
                                rules: [{
                                    required: true,
                                    message: "月份必填"
                                }]
                            })(<MonthPicker format="YYYY-MM" style={{ width: '100%' }}
                            />)}
                        </FormItem>
                    </Col>
                    {/* <Col {...formLayout}>
                        <FormItem {...formItemLayout} label="X类型">
                            {getFieldDecorator('XType', {
                                rules: [{
                                    required: true,
                                    message: "X类型必填"
                                }]
                            })(
                                <Select placeholder="请选择">
                                    <Option value={-9999}>全部</Option>
                                    <Option value={1}>工资</Option>
                                    <Option value={2}>社保</Option>
                                    <Option value={3}>管理费</Option>
                                    <Option value={4}>招聘费</Option>
                                    <Option value={5}>自离工资</Option>
                                    <Option value={6}>其他</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col> */}
                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label="姓名">
                            {getFieldDecorator('RealName')(<Input placeholder="请输入" maxLength={30} />)}
                        </FormItem>
                    </Col>
                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label="身份证号码">
                            {getFieldDecorator('IDCardNum', {
                                rules: [{
                                    pattern: /(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
                                    message: '请输入正确的18位身份证号'
                                }]
                            })(<Input placeholder="请输入" maxLength={18} />)}
                        </FormItem>
                    </Col>
                    <Col {...FormOptLayout} className='text-right'>
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