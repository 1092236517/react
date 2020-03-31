import React from 'react';
import { Form, Row, Col, DatePicker, Select, Input, Button } from 'antd';
import { observer } from 'mobx-react';
import { getFormOptLayout, formItemLayout, formLayout, createFormField } from 'ADMIN_UTILS/searchFormUtil';
import moment from 'moment';
const formOptLayout = getFormOptLayout(14);
@observer
class SearchFormComp extends React.Component {

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.handleSubmit();
            }
            window._czc.push(['_trackEvent', '名单管理', '查询', '名单管理_Y结算']);
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
                                    label="面试日期">
                                    {getFieldDecorator('StartDate', {
                                        initialValue: moment().subtract(7, 'days'),
                                        rules: [
                                            {
                                                required: true,
                                                message: '面试日期不能为空'
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
                                                        callback('面试日期不能为空');
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
                        <Row>
                            <Col span={14}>
                                <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="入职日期">
                                    {getFieldDecorator('EntryDtBegin')(
                                        <DatePicker disabledDate={(startValue) => {
                                            const endValue = getFieldValue('EntryDtEnd');
                                            if (!startValue || !endValue) {
                                                return false;
                                            }
                                            return startValue.isAfter(endValue, 'day');
                                        }} />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={10}>
                                <Form.Item labelCol={{ span: 1 }} wrapperCol={{ span: 23 }} label="-">
                                    {getFieldDecorator('EntryDtEnd')(
                                        <DatePicker disabledDate={(endValue) => {
                                            const startValue = getFieldValue('EntryDtBegin');
                                            if (!endValue || !startValue) {
                                                return false;
                                            }
                                            return endValue.isBefore(startValue, 'day');
                                        }} />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>

                    <Col {...formLayout}>
                        <Row>
                            <Col span={14}>
                                <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="离职日期">
                                    {getFieldDecorator('LeaveDtBegin')(
                                        <DatePicker disabledDate={(startValue) => {
                                            const endValue = getFieldValue('LeaveDtEnd');
                                            if (!startValue || !endValue) {
                                                return false;
                                            }
                                            return startValue.isAfter(endValue, 'day');
                                        }} />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={10}>
                                <Form.Item labelCol={{ span: 1 }} wrapperCol={{ span: 23 }} label="-">
                                    {getFieldDecorator('LeaveDtEnd')(
                                        <DatePicker disabledDate={(endValue) => {
                                            const startValue = getFieldValue('LeaveDtBegin');
                                            if (!endValue || !startValue) {
                                                return false;
                                            }
                                            return endValue.isBefore(startValue, 'day');
                                        }} />
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>

                    <Col {...formLayout}>
                        <Form.Item label="选择企业" {...formItemLayout}>
                            {getFieldDecorator('RealEntId')(
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
                        <Form.Item label="是否绑定订单" {...formItemLayout}>
                            {getFieldDecorator('IsBindOrder')(
                                <Select placeholder="请选择">
                                    <Select.Option value={-9999}>全部</Select.Option>
                                    <Select.Option value={1}>是</Select.Option>
                                    <Select.Option value={2}>否</Select.Option>
                                </Select>
                            )}
                        </Form.Item>
                    </Col>
                    <Col {...formLayout}>
                        <Form.Item label="面试状态" {...formItemLayout}>
                            {getFieldDecorator('IntvSts')(
                                <Select placeholder="请选择">
                                    <Select.Option value={-9999}>全部</Select.Option>
                                    <Select.Option value={2}>通过</Select.Option>
                                    <Select.Option value={3}>不通过</Select.Option>
                                    <Select.Option value={4}>放弃</Select.Option>
                                    <Select.Option value={1}>未面试</Select.Option>
                                    <Select.Option value={0}>未处理</Select.Option>
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
                            {getFieldDecorator('Realname')(
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
                        <Form.Item label="在职状态" {...formItemLayout}>
                            {getFieldDecorator('WorkSts')(
                                <Select placeholder="请选择">
                                    <Select.Option value={-9999}>全部</Select.Option>
                                    <Select.Option value={1}>在职</Select.Option>
                                    <Select.Option value={3}>转正</Select.Option>
                                    <Select.Option value={4}>未入职</Select.Option>
                                    <Select.Option value={2}>离职</Select.Option>
                                    <Select.Option value={5}>未知</Select.Option>
                                    <Select.Option value={6}>自离</Select.Option>
                                </Select>
                            )}
                        </Form.Item>
                    </Col>
                    <Col {...formLayout}>
                        <Form.Item label="名单是否作废" {...formItemLayout}>
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