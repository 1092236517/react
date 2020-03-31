import React from 'react';
import {Input, Button, Form, Row, Col} from 'antd';
import {observer} from "mobx-react";
import { createFormField, formLayout, formItemLayout } from 'ADMIN_UTILS/searchFormUtil';

const FormItem = Form.Item;

@observer
class SearchForm extends React.Component {
    constructor(props) {
        super(props);
    }
    getFormOptLayout(itemCount) {
        // 搜索条件的个数
        return {
            lg: {span: (4 - itemCount % 4) * 6},
            md: {span: (3 - itemCount % 3) * 8},
            sm: {span: (2 - itemCount % 2) * 12}
        };
    }

    formItemLayout = {
        labelCol: {span: 8, offset: 0},
        wrapperCol: {span: 16, offset: 0}
    };

    formLayout = {
        sm: {span: 12, offset: 0},
        md: {span: 8, offset: 0},
        lg: {span: 6, offset: 0}
    };

    formOptLayout = this.getFormOptLayout(3);

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) return;
            this.props.handleSubmit();
            window._czc.push(['_trackEvent', '用户管理', '查询', '用户管理_N非结算']);
        });
    };

    handleFormReset = (e) => {
        this.props.handleFormReset();
    };
    render() {
        const {form} = this.props;
        const {getFieldDecorator} = form;
        return (
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <Row gutter={15} type="flex" justify="start">
                        <Col {...formLayout}>
                            <FormItem {...formItemLayout}
                                    label="用户名">
                                {getFieldDecorator('Mobile')(<Input placeholder="请输入用户名"/>)}
                            </FormItem>
                        </Col>
                        <Col {...formLayout}>
                            <FormItem {...formItemLayout}
                                    label="姓名">
                                {getFieldDecorator('CnName')(<Input placeholder="请输入姓名"/>)}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                            <Col span={8} offset={16} className="mb-16 text-right">
                                <Button onClick={this.handleFormReset}>重置</Button>
                                <Button className="ml-8" type="primary" htmlType="submit">查询</Button>
                            </Col>
                    </Row>
                </Form>
            </div>
        );
    }
}
export default Form.create({
    mapPropsToFields: props => createFormField(props.searchValue),
    onValuesChange: (props, changedValues, allValues) => props.onValuesChange(allValues)
})(SearchForm);
