import 'ADMIN_ASSETS/less/pages/bAccountManager.less';
import { getFormOptLayout, formItemLayout, formLayout, createFormField } from 'ADMIN_UTILS/searchFormUtil';
import { selectInputSearch } from 'ADMIN_UTILS';
import { Button, Col, DatePicker, Form, Row, Select } from 'antd';
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
            window._czc.push(['_trackEvent', '1.0盈利报表', '查询', '1.0盈利报表_Y结算']);
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
                        <FormItem {...formItemLayout} label="企业名称">
                            {getFieldDecorator('EntId')(
                                <Select showSearch
                                    allowClear={true}
                                    placeholder="请选择"
                                    optionFilterProp="children"
                                    filterOption={selectInputSearch} >
                                    {
                                        companyList.map((item, index) => (<Option key={index} value={item.EntId}>{item.EntShortName}</Option>))
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label="劳务名称">
                            {getFieldDecorator('TrgtSpId')(
                                <Select showSearch
                                    allowClear={true}
                                    placeholder="请选择"
                                    optionFilterProp="children"
                                    filterOption={selectInputSearch} >
                                    {
                                        laborList.map((item, index) => (<Option key={index} value={item.SpId}>{item.SpShortName}</Option>))
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label="X欠款">
                            {getFieldDecorator('IsTrgtSpArrears')(
                                <Select placeholder="请选择">
                                    <Option value={-9999}>全部</Option>
                                    <Option value={2}>是</Option>
                                    <Option value={1}>否</Option>

                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label="是否关账">
                            {getFieldDecorator('IsClose')(
                                <Select placeholder="请选择">
                                    <Option value={-9999}>全部</Option>
                                    <Option value={2}>是</Option>
                                    <Option value={1}>否</Option>

                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col {...formLayout}>
                        <Row>
                            <Col span={14}>
                                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="选择月份">
                                    {getFieldDecorator('BeginMo', {
                                        rules: [{ required: true, message: '请选择月份！' }]
                                    })(
                                        <MonthPicker
                                            allowClear={false}
                                            format="YYYY-MM"
                                            disabledDate={(startValue) => {
                                                const endValue = getFieldValue('EndMo');
                                                if (!startValue || !endValue) {
                                                    return false;
                                                }
                                                return startValue.isAfter(endValue, 'day');
                                            }} />)}
                                </FormItem>
                            </Col>
                            <Col span={10}>
                                <FormItem labelCol={{ span: 1 }} wrapperCol={{ span: 23 }} label="-" colon={false}>
                                    {getFieldDecorator('EndMo', {
                                        rules: [{ required: true, message: '请选择月份！' }]
                                    })(
                                        <MonthPicker
                                            allowClear={false}
                                            format="YYYY-MM"
                                            disabledDate={(endValue) => {
                                                const startValue = getFieldValue('BeginMo');
                                                if (!endValue || !startValue) {
                                                    return false;
                                                }
                                                return endValue.isBefore(startValue, 'day');
                                            }} />)}
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>
                    <Col {...formOptLayout} className='text-right' >
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
