import React, { Component } from 'react';
import { observer } from "mobx-react";
import { Form, Row, Col, DatePicker, Button, Select, message } from 'antd';
import { getFormOptLayout, formItemLayout, formLayout, createFormField } from 'ADMIN_UTILS/searchFormUtil';
import { selectInputSearch } from 'ADMIN_UTILS';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;

@observer
class SearchForm extends Component {
    startQuery = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }

            const { StartDt, EndDt } = fieldsValue;

            if (StartDt.clone().add(30, 'days').isBefore(EndDt, 'day')) {
                message.info('打卡日期跨度不能超过30天。');
                return;
            }

            const { startQuery } = this.props;
            window._czc.push(['_trackEvent', '打卡统计', '查询', '打卡统计_Y结算']);
            startQuery();
        });
    }

    render() {
        const {
            form: {
                getFieldDecorator, getFieldValue
            },
            companyList,
            resetForm
        } = this.props;
        const formOptLayout = getFormOptLayout(2);

        return (
            <Form onSubmit={this.startQuery}>
                <Row gutter={15} type="flex" justify="start">
                    <Col {...formLayout}>
                        <Row>
                            <Col span={14}>
                                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="打卡日期">
                                    {getFieldDecorator('StartDt', {
                                        initialValue: moment().clone().subtract(8, 'days')
                                    })(
                                        <DatePicker
                                            allowClear={false}
                                            disabledDate={(startValue) => {
                                                const endValue = getFieldValue('EndDt');
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
                                    {getFieldDecorator('EndDt', {
                                        initialValue: moment().clone().subtract(1, 'days')
                                    })(
                                        <DatePicker
                                            allowClear={false}
                                            disabledDate={(endValue) => {
                                                const startValue = getFieldValue('StartDt');
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
                        <FormItem {...formItemLayout} label='企业'>
                            {getFieldDecorator('EntId')(
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

                    <Col {...formOptLayout} className='text-right' >
                        <FormItem label=''>
                            <Button onClick={resetForm}>重置</Button>
                            <Button type='primary' htmlType='submit' className='ml-8'>查询</Button>
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