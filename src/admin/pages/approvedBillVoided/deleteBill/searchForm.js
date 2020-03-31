import React, { Component } from 'react';
import { observer } from "mobx-react";
import { Form, Row, Col, Input, DatePicker, Button, Select } from 'antd';
import { formItemLayout, formLayout, getFormOptLayout, createFormField } from 'ADMIN_UTILS/searchFormUtil';
import { selectInputSearch } from 'ADMIN_UTILS';

const FormItem = Form.Item;
const { Option } = Select;

@observer
class SearchForm extends Component {

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { Condition, addCondition, deleteCondition } = this.props;
        const { arr } = Condition;
        const formOptLayout = getFormOptLayout(1);
        return (
            <Form>
                <Row gutter={15} type="flex" justify="start">
                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='账单类型'>
                            {getFieldDecorator('BillType')(
                                <Select
                                    allowClear={true}
                                    placeholder='请选择'
                                    filterOption={selectInputSearch}
                                    optionFilterProp="children"
                                    showSearch>
                                    <Option key='2' value='2'>周薪账单</Option>
                                    <Option key='1' value='1'>月薪账单</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label='批次号'>
                            {getFieldDecorator('Condition')(
                                <Input placeholder="请输入批次号" type="number" />
                            )}
                        </FormItem>
                    </Col>

                     <Col {...formOptLayout} className="text-right">
                        <FormItem>
                            <Button type="primary" className="ml-8" onClick={addCondition}>添加批次号</Button>
                        </FormItem>
                     </Col>
                </Row>
                {
                    arr && arr.map((item, index)=>(
                        <Row gutter={15} type="flex" justify="start" key={index}>
                            <Col {...formLayout}>
                                <FormItem {...formItemLayout} label=" ">
                                    {getFieldDecorator(`Condition${index}`)(
                                        <Input placeholder="请输入批次号" type="number" maxLength={10} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col {...formLayout}><Button onClick={()=>{deleteCondition(index);}}>删除</Button></Col>
                        </Row>
                    ))
                }
            </Form>
        );
    }
}

SearchForm = Form.create({
    mapPropsToFields: props => createFormField(props.searchValue),
    onValuesChange: (props, changedValues, allValues) => props.handleFormValuesChange(allValues)
})(SearchForm);

export default SearchForm;
