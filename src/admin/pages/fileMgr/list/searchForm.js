import React, { Component } from 'react';
import { observer } from "mobx-react";
import { Form, Row, Col, DatePicker, Button, Select } from 'antd';
import { formItemLayout, formLayout, getFormOptLayout, createFormField } from 'ADMIN_UTILS/searchFormUtil';
import { selectInputSearch } from 'ADMIN_UTILS';

const FormItem = Form.Item;
const { Option } = Select;

@observer
class SearchForm extends Component {
    constructor(props) {
        super(props);
    }

    startQuery = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }

            const { startQuery, resetPageCurrent } = this.props;
            resetPageCurrent();
            startQuery();
            window._czc.push(['_trackEvent', '文件查询', '查询', '文件查询_Y结算']);
        });
    }

    handleReset = (e) => {
        const { handleFormReset } = this.props;
        handleFormReset();
    }

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { companyList, laborList } = this.props;
        const formOptLayout = getFormOptLayout(6);


        return (
            <Form onSubmit={this.startQuery}>
                <Row gutter={15} type="flex" justify="start">
                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='劳务'>
                            {getFieldDecorator('LaborID')(
                                <Select
                                    allowClear={true}
                                    placeholder='请选择'
                                    filterOption={selectInputSearch}
                                    optionFilterProp="children"
                                    showSearch>
                                    {
                                        laborList.map((value) => {
                                            return <Option key={value.SpId} value={value.SpId}>{value.SpShortName}</Option>;
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>

                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='企业'>
                            {getFieldDecorator('EnterID')(
                                <Select
                                    allowClear={true}
                                    placeholder='请选择'
                                    filterOption={selectInputSearch}
                                    optionFilterProp="children"
                                    showSearch>
                                    {
                                        companyList.map((value) => {
                                            return <Option key={value.EntId} value={value.EntId}>{value.EntShortName}</Option>;
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>

                    <Col {...formLayout}>
                        <Row>
                            <Col span={14}>
                                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="上传日期">
                                    {getFieldDecorator('BeginUploadDate')(
                                        <DatePicker
                                            disabledDate={(startValue) => {
                                                const endValue = getFieldValue('EndUploadDate');
                                                if (!startValue || !endValue) {
                                                    return false;
                                                }
                                                return startValue.isAfter(endValue, 'day');
                                            }} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={10}>
                                <FormItem labelCol={{ span: 1 }} wrapperCol={{ span: 23 }} label="-">
                                    {getFieldDecorator('EndUploadDate')(
                                        <DatePicker
                                            disabledDate={(endValue) => {
                                                const startValue = getFieldValue('BeginUploadDate');
                                                if (!endValue || !startValue) {
                                                    return false;
                                                }
                                                return endValue.isBefore(startValue, 'day');
                                            }} />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>

                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='归属月份'>
                            {getFieldDecorator('Month')(
                                <DatePicker.MonthPicker className='w-100' />
                            )}
                        </FormItem>
                    </Col>

                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='类型'>
                            {getFieldDecorator('FileType', {
                                initialValue: -9999
                            })(
                                <Select placeholder='请选择'>
                                    <Option value={-9999}>全部</Option>
                                    <Option value={1}>周薪</Option>
                                    <Option value={2}>月薪</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>

                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='审核状态'>
                            {getFieldDecorator('AuditState', {
                                initialValue: -9999
                            })(
                                <Select>
                                    <Option value={-9999}>全部</Option>
                                    <Option value={1}>待审核</Option>
                                    <Option value={2}>审核通过</Option>
                                    <Option value={3}>审核不通过</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>

                    <Col {...formOptLayout} className="text-right">
                        <FormItem>
                            <Button onClick={this.handleReset}>重置</Button>
                            <Button type="primary" htmlType="submit" className="ml-8">查询</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    }
}

SearchForm = Form.create({
    mapPropsToFields: props => (createFormField(props.searchValue)),
    onValuesChange: (props, changedValues, allValues) => (props.handleFormValuesChange(allValues))
})(SearchForm);

export default SearchForm;