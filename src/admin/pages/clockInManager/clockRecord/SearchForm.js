import React from 'react';
import { Form, Button, Input, Select, DatePicker, Row, Col } from 'antd';
import moment from 'moment';
import { getFormOptLayout, formItemLayout, formLayout, createFormField } from 'ADMIN_UTILS/searchFormUtil';
const formOptLayout = getFormOptLayout(10);

class SearchFormComp extends React.Component {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.handleSubmit();
                window._czc.push(['_trackEvent', '打卡记录管理', '查询', '打卡记录管理_Y结算']);
            }
        });
    }

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { handleFormReset, agentList, companyList, laborList, loading } = this.props;
        return (
            <Form>
                <Row gutter={15} type="flex" justify="start">
                    <Col {...formLayout}>
                        <Row>
                            <Col span={14}>
                                <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}
                                    label="打卡日期">
                                    {getFieldDecorator('ClockStartDt', {
                                        initialValue: moment().subtract(14, 'days'),
                                        rules: [
                                            {
                                                required: true,
                                                message: '打卡日期不能为空'
                                            }
                                        ]
                                    })(
                                        <DatePicker
                                            allowClear={false}
                                            format="YYYY-MM-DD"
                                            disabledDate={(currentDate) =>
                                                getFieldValue('ClockEndDt') ? moment(currentDate).isAfter(moment(getFieldValue('ClockEndDt')), 'days') : false
                                            }
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={10}>
                                <Form.Item labelCol={{ span: 1 }} wrapperCol={{ span: 23 }} label="-" colon={false}>
                                    {getFieldDecorator('ClockEndDt', {
                                        initialValue: moment().subtract(14, 'days'),
                                        rules: [
                                            {
                                                validator: (rule, value, callback) => {
                                                    if (!value) {
                                                        callback('打卡日期不能为空');
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
                                                getFieldValue('ClockStartDt') ? moment(currentDate).isBefore(moment(getFieldValue('ClockStartDt')), 'days') : false
                                            }
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                    <Col {...formLayout}>
                        <Form.Item label="选择企业" {...formItemLayout}>
                            {getFieldDecorator('EntID')(
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
                        <Form.Item label="是否有周薪" {...formItemLayout}>
                            {getFieldDecorator('IsWeekly')(
                                <Select placeholder="请选择">
                                    <Select.Option value={-9999}>全部</Select.Option>
                                    <Select.Option value={1}>是</Select.Option>
                                    <Select.Option value={2}>否</Select.Option>
                                </Select>
                            )}
                        </Form.Item>
                    </Col>
                    <Col {...formLayout}>
                        <Form.Item label="身份证号码" {...formItemLayout}>
                            {getFieldDecorator('IdCardNum', {
                                rules: [{
                                    pattern: /(^\d{17}(\d|X|x)$)/,
                                    message: '请输入正确的18位身份证号码'
                                }]
                            })(
                                <Input placeholder='请输入' maxLength={18} />
                            )}
                        </Form.Item>
                    </Col>
                    <Col {...formLayout}>
                        <Form.Item label="姓名" {...formItemLayout}>
                            {getFieldDecorator('RealName')(
                                <Input placeholder="请输入" maxLength={10} />
                            )}
                        </Form.Item>
                    </Col>
                    <Col {...formLayout}>
                        <Form.Item label="手机号码" {...formItemLayout}>
                            {getFieldDecorator('Mobile', {
                                rules: [{
                                    pattern: /^1[3-9][0-9]\d{8}$/,
                                    message: '请输入正确的手机号格式'
                                }]
                            })(
                                <Input placeholder="请输入" maxLength={11} />
                            )}
                        </Form.Item>
                    </Col>
                    <Col {...formLayout}>
                        <Form.Item label="工牌" {...formItemLayout}>
                            {getFieldDecorator('WorkCardNo')(
                                <Input placeholder="请输入" maxLength={20} />
                            )}
                        </Form.Item>
                    </Col>
                    <Col {...formLayout}>
                        <Form.Item label="是否补卡" {...formItemLayout}>
                            {getFieldDecorator('IsRepaired')(
                                <Select placeholder="请选择">
                                    <Select.Option value={-9999}>全部</Select.Option>
                                    <Select.Option value={1}>是</Select.Option>
                                    <Select.Option value={2}>否</Select.Option>
                                </Select>
                            )}
                        </Form.Item>
                    </Col>
                    <Col {...formOptLayout} className='text-right'>
                        <Form.Item>
                            <Button onClick={handleFormReset}>重置</Button>
                            <Button className="ml-8" loading={loading} type="primary" onClick={this.handleSubmit}>查询</Button>
                        </Form.Item>
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
