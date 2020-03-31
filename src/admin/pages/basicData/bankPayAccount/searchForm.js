import React, { Component } from 'react';
import { observer } from "mobx-react";
import { Form, Row, Col, Input, Button } from 'antd';
import { getFormOptLayout, formItemLayout, formLayout, createFormField } from 'ADMIN_UTILS/searchFormUtil';

const FormItem = Form.Item;

@observer
class SearchForm extends Component {
    startQuery = (e) => {
        e.preventDefault();
        window._czc.push(['_trackEvent', '银行付款账号管理', '查询', '银行付款账号管理_Y结算']);
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }

            const { startQuery, resetPageCurrent } = this.props.bankPayAccountStore;
            resetPageCurrent();
            startQuery();
        });
    }

    handleReset = (e) => {
        const { resetFields, setFieldsValue } = this.props.form;
        resetFields();
        // 手动清空，触发form的onValuesChange事件
        setFieldsValue({
            BankCardNum: ''
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formOptLayout = getFormOptLayout(2);

        return (
            <Form onSubmit={this.startQuery}>
                <Row gutter={15} type="flex" justify="start">
                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='付款账号'>
                            {getFieldDecorator('BankCardNum', {
                                initialValue: ''
                            })(
                                <Input placeholder='请输入' maxLength={50} />
                            )}
                        </FormItem>
                    </Col>

                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='付款账号名'>
                            {getFieldDecorator('BankAccntName', {
                                initialValue: ''
                            })(
                                <Input placeholder='请输入' maxLength={50} />
                            )}
                        </FormItem>
                    </Col>

                    <Col {...formOptLayout} className='text-right' >
                        <FormItem label=''>
                            <Button onClick={this.handleReset}>重置</Button>
                            <Button type='primary' htmlType='submit' className='ml-8'>查询</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    }
}

SearchForm = Form.create({
    mapPropsToFields: props => {
        const { view: { searchValue } } = props.bankPayAccountStore;
        return createFormField(searchValue);
    },
    onValuesChange: (props, changedValues, allValues) => {
        props.bankPayAccountStore.handleFormValuesChange(allValues);
    }
})(SearchForm);

export default SearchForm;