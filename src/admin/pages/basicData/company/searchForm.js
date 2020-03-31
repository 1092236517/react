import React from 'react';
import { Row, Col, Select, Form, Button, Input } from 'antd';
import { getFormOptLayout, formItemLayout, formLayout, createFormField } from 'ADMIN_UTILS/searchFormUtil';

const formOptLayout = getFormOptLayout(3);

const SearchForm = Form.create({
    mapPropsToFields: props => createFormField(props.formValue)
    // onValuesChange: (props, changedValues, allValues) => props.onValuesChange(allValues)
})(({handleSubmit, handleFormReset, form, companyList = []}) => {
    const {getFieldDecorator} = form;
    return (
        <Form onSubmit={(e) => {
            window._czc.push(['_trackEvent', '企业基础数据', '查询', '企业基础数据_N非结算']);
            e.preventDefault();
            form.validateFields((err, fieldsValue) => {
                console.log(err, fieldsValue);
                if (err) return;
                handleSubmit(fieldsValue);
            });
        }}>
            <Row>
                <Col {...formLayout}>
                    <Form.Item {...formItemLayout} label="企业简称">
                        {getFieldDecorator('EntID')(
                            <Select showSearch
                                    allowClear={true}
                                    placeholder="请选择企业"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                {
                                    companyList.map((item, index) =>
                                        <Select.Option key={index}
                                                       value={item.EntId}>{item.EntShortName}</Select.Option>)
                                }
                            </Select>
                        )}
                    </Form.Item>
                </Col>
                <Col {...formLayout}>
                    <Form.Item {...formItemLayout} label="联系人">
                        {getFieldDecorator('CtctName')(<Input placeholder='请输入' maxLength={10}/>)}
                    </Form.Item>
                </Col>
                <Col {...formLayout}>
                    <Form.Item {...formItemLayout} label="手机号码">
                        {getFieldDecorator('CtctMobile', {
                            rules: [
                                {pattern: /^[0-9]*$/, message: '请输入正确的手机号码'}
                            ]
                        })(<Input placeholder='请输入' maxLength={11}/>)}
                    </Form.Item>
                </Col>
                <Col {...formOptLayout} className='text-right'>
                    <Form.Item>
                        <Button onClick={handleFormReset}>重置</Button>
                        <Button className="ml-8" type="primary" htmlType="submit">查询</Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
});

export default SearchForm;