import React from 'react';
import { Form, DatePicker, Select, Row, Col, Button } from 'antd';
import moment from 'moment';
import { getFormOptLayout, formItemLayout, formLayout, createFormField } from 'ADMIN_UTILS/searchFormUtil';
const { Option } = Select;

class SearchFormComp extends React.Component {

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.handleSubmit();
                window._czc.push(['_trackEvent', '订单管理', '查询', '订单管理_Y结算']);
            }
        });
    }

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { handleFormReset, agentList, companyList, laborList, loading } = this.props;
        const formOptLayout = getFormOptLayout(7);

        return (
            <Form>
                <Row gutter={15} type="flex" justify="start">
                    <Col {...formLayout}>
                        <Row>
                            <Col span={14}>
                                <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}
                                    label="报价日期">
                                    {getFieldDecorator('StartDate', {
                                        initialValue: moment().subtract(7, 'days'),
                                        rules: [
                                            {
                                                required: true,
                                                message: '归属日期不能为空'
                                            }
                                        ]
                                    })(
                                        <DatePicker
                                            allowClear={false}
                                            format="YYYY-MM-DD"
                                            disabledDate={(currentDate) =>
                                                getFieldValue('EndDate') ? moment(currentDate).isAfter(moment(getFieldValue('EndDate')), 'days') : false
                                            }
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={10}>
                                <Form.Item labelCol={{ span: 1 }} wrapperCol={{ span: 23 }} label="-" colon={false}>
                                    {getFieldDecorator('EndDate', {
                                        initialValue: moment(),
                                        rules: [
                                            {
                                                validator: (rule, value, callback) => {
                                                    if (!value) {
                                                        callback('归属日期不能为空');
                                                    } else {
                                                        callback();
                                                    }
                                                }
                                            }
                                        ]
                                    })(
                                        <DatePicker
                                            allowClear={false}
                                            format="YYYY-MM-DD"
                                            disabledDate={(currentDate) =>
                                                getFieldValue('StartDate') ? moment(currentDate).isBefore(moment(getFieldValue('StartDate')), 'days') : false
                                            }
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                    <Col {...formLayout}>
                        <Form.Item label="选择企业" {...formItemLayout}>
                            {getFieldDecorator('EntId')(
                                <Select
                                    showSearch
                                    allowClear={true}
                                    placeholder="请选择"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {companyList.map((item, index) => <Select.Option key={index} value={item.EntId}>{item.EntShortName}</Select.Option>)}
                                </Select>
                            )}
                        </Form.Item>
                    </Col>
                    <Col {...formLayout}>
                        <Form.Item label="选择劳务" {...formItemLayout}>
                            {getFieldDecorator('TrgtSpId')(
                                <Select
                                    showSearch
                                    allowClear={true}
                                    placeholder="请选择"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {laborList.map((item, index) => <Select.Option key={index} value={item.SpId}>{item.SpShortName}</Select.Option>)}
                                </Select>
                            )}
                        </Form.Item>
                    </Col>
                    <Col {...formLayout}>
                        <Form.Item label="选择中介" {...formItemLayout}>
                            {getFieldDecorator('SrceSpId')(
                                <Select showSearch
                                    allowClear={true}
                                    placeholder="请选择"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {agentList.map((item, index) => <Select.Option key={index} value={item.SpId}>{item.SpShortName}</Select.Option>)}
                                </Select>
                            )}
                        </Form.Item>
                    </Col>
                    <Col {...formLayout}>
                        <Form.Item label="是否作废" {...formItemLayout}>
                            {getFieldDecorator('IsValid')(
                                <Select placeholder="请选择">
                                    <Select.Option value={-9999}>全部</Select.Option>
                                    <Select.Option value={1}>正常</Select.Option>
                                    <Select.Option value={2}>已作废</Select.Option>
                                </Select>
                            )}
                        </Form.Item>
                    </Col>
                    <Col {...formLayout}>
                        <Form.Item label="用工模式" {...formItemLayout}>
                            {getFieldDecorator('EmploymentType')(
                                <Select placeholder="请选择">
                                    <Select.Option value={-9999}>全部模式</Select.Option>
                                    <Select.Option value={1}>劳务用工</Select.Option>
                                    <Select.Option value={2}>灵活用工爱员工</Select.Option>
                                </Select>
                            )}
                        </Form.Item>
                    </Col>

                    <Col {...formLayout}>
                        <Form.Item {...formItemLayout} label='结算模式'>
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
                        </Form.Item>
                    </Col>

                    <Col {...formOptLayout} className='text-right'>
                        <Button onClick={handleFormReset}>重置</Button>
                        <Button className="ml-8" loading={loading} type="primary" onClick={this.handleSubmit}>查询</Button>
                    </Col>
                </Row>
            </Form>
        );
    }
}

export default Form.create({
    mapPropsToFields: props => createFormField(props.searchValue),
    onValuesChange: (props, changedValues, allValues) => {
        props.onValuesChange(allValues);
    }
})(SearchFormComp);