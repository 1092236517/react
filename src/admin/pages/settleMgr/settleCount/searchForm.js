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
            window._czc.push(['_trackEvent', 'ZX结算汇总', '查询', 'ZX结算汇总_Y结算']);
        });
    }

    render() {
        const { form } = this.props;
        const { getFieldDecorator, getFieldValue } = form;
        const { companyList, laborList } = this.props;
        return (
            <Form onSubmit={this.handleFormSubmit}>
                <Row gutter={12}>
                    <Col span={5}>
                        <FormItem {...formItemLayout} label="劳务名称">
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
                    <Col span={5}>
                        <FormItem {...formItemLayout} label="企业名称">
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
                    <Col span={4}>
                        <FormItem {...formItemLayout} label="处理状态">
                            {getFieldDecorator('DealSts')(
                                <Select placeholder="请选择">
                                    <Option value={-9999}>全部</Option>
                                    <Option value={1}>未处理</Option>
                                    <Option value={2}>已处理</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={7}>
                        <Row>
                            <Col span={14}>
                                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="月份">
                                    {getFieldDecorator('BeginDt')(
                                        <MonthPicker
                                            format="YYYY-MM"
                                            style={{ width: '100%' }}
                                            disabledDate={(startValue) => {
                                                const endValue = getFieldValue('EndDt');
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
                                    {getFieldDecorator('EndDt')(
                                        <MonthPicker
                                            format="YYYY-MM"
                                            style={{ width: '100%' }}
                                            disabledDate={(endValue) => {
                                                const startValue = getFieldValue('BeginDt');
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
                    <Col span={3} className='text-right'>
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