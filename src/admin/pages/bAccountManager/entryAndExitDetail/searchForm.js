import React from 'react';
import { Form, DatePicker, Select, Row, Col, Button } from 'antd';
import moment from 'moment';
import { getFormOptLayout, formItemLayout, formLayout, createFormField } from 'ADMIN_UTILS/searchFormUtil';
const { Option } = Select;
const { MonthPicker } = DatePicker;
class SearchFormComp extends React.Component {


    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }

            const { startQuery, resetPageCurrent, handleFormValuesChange, searchValue } = this.props;
            handleFormValuesChange({ ...searchValue, DireactType: '' });
            resetPageCurrent();
            startQuery();
            window._czc.push(['_trackEvent', '到账/出账明细', '查询', '到账/出账明细_N非结算']);
        });
    }
    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { handleFormReset, agentList, companyList, laborList, loading } = this.props;
        const formOptLayout = getFormOptLayout(3);

        return (
            <Form>
                <Row gutter={15} type="flex" justify="start">
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
                        <Form.Item label="操作类型" {...formItemLayout}>
                            {getFieldDecorator('OprTyp')(
                                <Select placeholder="请选择">
                                    <Select.Option value={-9999}>全部</Select.Option>
                                    <Select.Option value={1}>充值</Select.Option>
                                    <Select.Option value={2}>提现</Select.Option>
                                </Select>
                            )}
                        </Form.Item>
                    </Col>

                    <Col {...formLayout}>
                        <Form.Item label="拆分类型" {...formItemLayout}>
                            {getFieldDecorator('SplitTyp')(
                                <Select placeholder="请选择">
                                    <Select.Option value={-9999}>全部</Select.Option>
                                    <Select.Option value={1}>Z拆分</Select.Option>
                                    <Select.Option value={2}>押金</Select.Option>
                                    <Select.Option value={3}>ZX拆分</Select.Option>
                                    <Select.Option value={4}>利润拆分</Select.Option>
                                    <Select.Option value={5}>退税</Select.Option>
                                    <Select.Option value={6}>返费风险金</Select.Option>
                                </Select>
                            )}
                        </Form.Item>
                    </Col>


                    <Col {...formLayout}>
                        <Row>
                            <Col span={14}>
                                <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}
                                    label="录入日期">
                                    {getFieldDecorator('ApplyTmBegin', {
                                        rules: [
                                            //   {
                                            // required: true,
                                            // message: '开始日期不能为空'
                                            //   }
                                        ]
                                    })(
                                        <DatePicker
                                            allowClear={false}
                                            format="YYYY-MM-DD"
                                            disabledDate={(currentDate) =>
                                                getFieldValue('ApplyTmEnd') ? moment(currentDate).isAfter(moment(getFieldValue('ApplyTmEnd')), 'days') : false
                                            }
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={10}>
                                <Form.Item labelCol={{ span: 1 }} wrapperCol={{ span: 23 }} label="-" colon={false}>
                                    {getFieldDecorator('ApplyTmEnd', {
                                        rules: [
                                            //  {
                                            // validator: (rule, value, callback) => {
                                            //     if (!value) {
                                            //         callback('结束日期不能为空');
                                            //     } else {
                                            //         callback();
                                            //     }
                                            // }
                                            //  }
                                        ]
                                    })(
                                        <DatePicker
                                            allowClear={false}
                                            format="YYYY-MM-DD"
                                            disabledDate={(currentDate) =>
                                                getFieldValue('ApplyTmBegin') ? moment(currentDate).isBefore(moment(getFieldValue('ApplyTmBegin')), 'days') : false
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
                                <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}
                                    label="银行打款日期">
                                    {getFieldDecorator('TransferTmBegin', {
                                        rules: [
                                            // {
                                            //     required: true,
                                            //     message: '归属日期不能为空'
                                            // }
                                        ]
                                    })(
                                        <DatePicker
                                            allowClear={false}
                                            format="YYYY-MM-DD"
                                            disabledDate={(currentDate) =>
                                                getFieldValue('TransferTmEnd') ? moment(currentDate).isAfter(moment(getFieldValue('TransferTmEnd')), 'days') : false
                                            }
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={10}>
                                <Form.Item labelCol={{ span: 1 }} wrapperCol={{ span: 23 }} label="-" colon={false}>
                                    {getFieldDecorator('TransferTmEnd', {
                                        rules: [
                                            // {
                                            // validator: (rule, value, callback) => {
                                            //     if (!value) {
                                            //         callback('归属日期不能为空');
                                            //     } else {
                                            //         callback();
                                            //     }
                                            // }
                                            // }
                                        ]
                                    })(
                                        <DatePicker
                                            allowClear={false}
                                            format="YYYY-MM-DD"
                                            disabledDate={(currentDate) =>
                                                getFieldValue('TransferTmBegin') ? moment(currentDate).isBefore(moment(getFieldValue('TransferTmBegin')), 'days') : false
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
                                <Form.Item labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="月份">
                                    {getFieldDecorator('RelatedMoBegin')(<MonthPicker format="YYYY-MM" style={{ width: '100%' }}
                                        disabledDate={(RelatedMoBegin) => {
                                            const RelatedMoEnd = getFieldValue('RelatedMoEnd');
                                            if (!RelatedMoBegin || !RelatedMoEnd) {
                                                return false;
                                            }
                                            return RelatedMoBegin.isAfter(RelatedMoEnd, 'day');
                                        }} />)}
                                </Form.Item>
                            </Col>
                            <Col span={10}>
                                <Form.Item labelCol={{ span: 1 }} wrapperCol={{ span: 23 }} label="-" colon={false}>
                                    {getFieldDecorator('RelatedMoEnd')(<MonthPicker format="YYYY-MM" style={{ width: '100%' }}
                                        disabledDate={(RelatedMoEnd) => {
                                            const RelatedMoBegin = getFieldValue('RelatedMoBegin');
                                            if (!RelatedMoEnd || !RelatedMoBegin) {
                                                return false;
                                            }
                                            return RelatedMoEnd.isBefore(RelatedMoBegin, 'day');
                                        }} />)}
                                </Form.Item>
                            </Col>
                        </Row>
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
        props.handleFormValuesChange(allValues);
    }
})(SearchFormComp);