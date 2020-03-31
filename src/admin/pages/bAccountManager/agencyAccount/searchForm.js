import { Button, Col, Form, Input, Row, Select } from 'antd';
import { observer } from 'mobx-react';
import React from 'react';
import { getFormOptLayout, formItemLayout, formLayout, createFormField } from 'ADMIN_UTILS/searchFormUtil';

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
            window._czc.push(['_trackEvent', '中介费到账记录', '查询', '中介费到账记录_N非结算']);
        });
    }

    render() {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        const { agentList } = this.props;
        const formOptLayout = getFormOptLayout(3);

        return (
            <Form onSubmit={this.handleFormSubmit}>
                <Row gutter={15}>
                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label="中介名称">
                            {getFieldDecorator('SrceSpId')(
                                <Select showSearch
                                    allowClear={true}
                                    placeholder="请选择"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {
                                        agentList.map((item, index) => {
                                            return (
                                                <Option key={index} value={item.SpId}>{item.SpShortName}</Option>
                                            );
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>

                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label="联系人">
                            {getFieldDecorator('CtctName')(<Input placeholder="请输入" />)}
                        </FormItem>
                    </Col>

                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label="联系电话">
                            {getFieldDecorator('CtctMobile', {
                                rules: [{
                                    pattern: /^[1][2,3,4,5,6,7,8,9][0-9]{9}$/,
                                    message: "请输入正确的手机号码"
                                }
                                ]
                            })(<Input placeholder="请输入" maxLength={11} />)}
                        </FormItem>
                    </Col>
                    <Col {...formOptLayout} className='text-right' >
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