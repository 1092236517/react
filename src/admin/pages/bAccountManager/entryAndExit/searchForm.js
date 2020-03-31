import 'ADMIN_ASSETS/less/pages/bAccountManager.less';
import { createFormField, formItemLayout, formLayout, getFormOptLayout } from 'ADMIN_UTILS/searchFormUtil';
import { Button, Col, DatePicker, Form, Row, Select, Input, InputNumber } from 'antd';
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
        this.props.form.validateFields((err, allValues) => {
            if (err) return;
            this.props.resetPageCurrent();
            this.props.searchByInput(allValues);
        });
    }

    render() {
        const { form } = this.props;
        const { getFieldDecorator, getFieldValue } = form;
        const { laborList } = this.props;
        const formOptLayout = getFormOptLayout(6);

        return (
            <Form onSubmit={this.handleFormSubmit}>
                <Row gutter={15} >
                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label="劳务简称">
                            {getFieldDecorator('SPID')(
                                <Select showSearch
                                    allowClear={true}
                                    mode="multiple"
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
                    {/* <Col {...formLayout}>
                        <FormItem {...formItemLayout} label="联系人">
                            {getFieldDecorator('SPContactName')(<Input placeholder="请输入"/>)}
                        </FormItem>
                    </Col>

                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label="联系电话">
                            {getFieldDecorator('SPContactMobile', {
                                    rules: [{
                                            pattern: /^[1][2,3,4,5,6,7,8,9][0-9]{9}$/,
                                            message: "请输入正确的手机号码"
                                        }
                                    ]
                                })(<Input placeholder="请输入" maxLength = {11}/>)}
                        </FormItem>
                    </Col> */}
                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label="出入金类型">
                            {getFieldDecorator('OPType')(
                                <Select placeholder="请选择">
                                    <Option value={-9999}>全部</Option>
                                    <Option value={1}>充值</Option>
                                    <Option value={2}>提现</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label="拆分状态">
                            {getFieldDecorator('SplitSts')(
                                <Select placeholder="请选择">
                                    <Option value={-9999}>全部</Option>
                                    <Option value={1}>未拆分</Option>
                                    <Option value={2}>已拆分</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label="审核状态">
                            {getFieldDecorator('AuditStatus')(
                                <Select placeholder="请选择">
                                    <Option value={-9999}>全部</Option>
                                    <Option value={1}>待审核</Option>
                                    <Option value={2}>通过</Option>
                                    <Option value={3}>拒绝</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col {...formLayout}>
                        <Row>
                            <Col span={14}>
                                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="申请时间">
                                    {getFieldDecorator('BeginDate')(<DatePicker format="YYYY-MM-DD" style={{ width: '100%' }}
                                        disabledDate={(startValue) => {
                                            const endValue = getFieldValue('EndDate');
                                            if (!startValue || !endValue) {
                                                return false;
                                            }
                                            return startValue.isAfter(endValue, 'day');
                                        }} />)}
                                </FormItem>
                            </Col>
                            <Col span={10}>
                                <FormItem labelCol={{ span: 1 }} wrapperCol={{ span: 23 }} label="-" colon={false}>
                                    {getFieldDecorator('EndDate')(<DatePicker format="YYYY-MM-DD" style={{ width: '100%' }}
                                        disabledDate={(endValue) => {
                                            const startValue = getFieldValue('BeginDate');
                                            if (!endValue || !startValue) {
                                                return false;
                                            }
                                            return endValue.isBefore(startValue, 'day');
                                        }} />)}
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>

                    <Col {...formLayout}>
                        <Row>
                            <Col span={14}>
                                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="银行打款时间">
                                    {getFieldDecorator('BankTransferTmS')(<DatePicker format="YYYY-MM-DD" style={{ width: '100%' }}
                                        disabledDate={(startValue) => {
                                            const endValue = getFieldValue('BankTransferTmE');
                                            if (!startValue || !endValue) {
                                                return false;
                                            }
                                            return startValue.isAfter(endValue, 'day');
                                        }} />)}
                                </FormItem>
                            </Col>
                            <Col span={10}>
                                <FormItem labelCol={{ span: 1 }} wrapperCol={{ span: 23 }} label="-" colon={false}>
                                    {getFieldDecorator('BankTransferTmE')(<DatePicker format="YYYY-MM-DD" style={{ width: '100%' }}
                                        disabledDate={(endValue) => {
                                            const startValue = getFieldValue('BankTransferTmS');
                                            if (!endValue || !startValue) {
                                                return false;
                                            }
                                            return endValue.isBefore(startValue, 'day');
                                        }} />)}
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>
                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label="虚拟到出帐">
                            {getFieldDecorator('IsVirtual')(
                                <Select placeholder="请选择">
                                    <Option value={-9999}>全部</Option>
                                    <Option value={1}>是</Option>
                                    <Option value={2}>否</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label="记录ID">
                            {getFieldDecorator('RecordID')(<Input placeholder="请输入" />)}
                        </FormItem>
                    </Col>

                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label="是否红冲">
                            {getFieldDecorator('IsRedRush')(
                                <Select placeholder="请选择">
                                    <Option value={-9999}>全部</Option>
                                    <Option value={1}>是</Option>
                                    <Option value={2}>否</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label="红冲ID">
                            {getFieldDecorator('BeRedRushID')(<Input placeholder="请输入" />)}
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