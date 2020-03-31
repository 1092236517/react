import { formItemLayout, formLayout, getFormOptLayout, createFormField } from 'ADMIN_UTILS/searchFormUtil';
import { Button, Col, DatePicker, Form, Input, Row, Select } from 'antd';
import { observer } from 'mobx-react';
import React from 'react';

const FormItem = Form.Item;
const Option = Select.Option;

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
            window._czc.push(['_trackEvent', '授权', '查询', '授权_Y结算']);
        });
    }

    render() {
        const { form } = this.props;
        const { getFieldDecorator, getFieldValue } = form;
        const { agentList, companyList, laborList, searchValue: { BillBatchTyp } } = this.props;
        const formOptLayout = getFormOptLayout(8);

        return (
            <Form onSubmit={this.handleFormSubmit}>
                <Row gutter={12} >
                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label="批次号">
                            {getFieldDecorator('BillBatchId')(<Input placeholder="请输入" />)}
                        </FormItem>
                    </Col>
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
                        <FormItem {...formItemLayout} label="选择中介">
                            {getFieldDecorator('SrceSpId')(
                                <Select showSearch
                                    allowClear={true}
                                    placeholder="请选择"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {
                                        agentList.length > 0 ? agentList.map((item, index) => {
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
                        <FormItem {...formItemLayout} label="类别">
                            {getFieldDecorator('BillBatchTyp')(
                                <Select placeholder="请选择">
                                    <Option value={-9999}>全部</Option>
                                    <Option value={1}>月薪</Option>
                                    <Option value={2}>周薪</Option>
                                    <Option value={3}>返费</Option>
                                    <Option value={4}>周返费</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label="来源">
                            {getFieldDecorator('BillSrce')(
                                <Select placeholder="请选择">
                                    <Option value={-9999}>全部</Option>
                                    <Option value={1}>批量导入</Option>
                                    <Option value={2}>手动补发</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label="授权状态">
                            {getFieldDecorator('AuthSts')(
                                <Select placeholder="请选择">
                                    <Option value={-9999}>全部</Option>
                                    <Option value={1}>未授权</Option>
                                    <Option value={2}>通过</Option>
                                    <Option value={3}>未通过</Option>
                                    <Option value={4}>数据异常</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col {...formLayout}>
                        <Row>
                            <Col span={14}>
                                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="发薪周期">
                                    {getFieldDecorator('SettleBeginDt')(
                                        <DatePicker
                                            disabled={BillBatchTyp == 3}
                                            format="YYYY-MM-DD"
                                            style={{ width: '100%' }}
                                            disabledDate={(startValue) => {
                                                const endValue = getFieldValue('SettleEndDt');
                                                if (!startValue || !endValue) {
                                                    return false;
                                                }
                                                return startValue.isAfter(endValue, 'day');
                                            }} />)}
                                </FormItem>
                            </Col>
                            <Col span={10}>
                                <FormItem labelCol={{ span: 1 }} wrapperCol={{ span: 23 }} label="-" colon={false}>
                                    {getFieldDecorator('SettleEndDt')(
                                        <DatePicker
                                            disabled={BillBatchTyp == 3}
                                            format="YYYY-MM-DD"
                                            style={{ width: '100%' }}
                                            disabledDate={(endValue) => {
                                                const startValue = getFieldValue('SettleBeginDt');
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