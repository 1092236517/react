import React, { Component } from 'react';
import { observer } from "mobx-react";
import { Form, Row, Col, Button, Select, Input } from 'antd';
import { formItemLayout, createFormField } from 'ADMIN_UTILS/searchFormUtil';
import { selectInputSearch } from 'ADMIN_UTILS';

const FormItem = Form.Item;
const Option = Select.Option;

@observer
class SearchForm extends Component {
    startQuery = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err) => {
            if (err) {
                return;
            }

            const { startQuery, resetPageCurrent } = this.props;
            resetPageCurrent();
            startQuery();
        });
    }

    render() {
        const { form: { getFieldDecorator }, resetForm, companyList, laborList } = this.props;

        return (
            <Form onSubmit={this.startQuery}>
                <Row gutter={15} type="flex" justify="start">
                    <Col span={5}>
                        <FormItem {...formItemLayout} label='企业'>
                            {getFieldDecorator('EntId')(
                                <Select
                                    allowClear={true}
                                    placeholder='请选择'
                                    filterOption={selectInputSearch}
                                    optionFilterProp="children"
                                    showSearch>
                                    {
                                        companyList.map((value) => <Option key={value.EntId} value={value.EntId}>{value.EntShortName}</Option>)
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>

                    <Col span={5}>
                        <FormItem {...formItemLayout} label='劳务'>
                            {getFieldDecorator('TrgtSpId')(
                                <Select
                                    allowClear={true}
                                    placeholder='请选择'
                                    filterOption={selectInputSearch}
                                    optionFilterProp="children"
                                    showSearch>
                                    {
                                        laborList.map((value) => <Option key={value.SpId} value={value.SpId}>{value.SpShortName}</Option>)
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>

                    <Col span={5}>
                        <FormItem {...formItemLayout} label='开票类型'>
                            {getFieldDecorator('InvoiceTyp')(
                                <Select>
                                    <Option value={-9999}>全部</Option>
                                    <Option value={1}>普票</Option>
                                    <Option value={2}>专票</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>

                    <Col span={5}>
                        <FormItem {...formItemLayout} label='审核状态'>
                            {getFieldDecorator('AuditSts')(
                                <Select>
                                    <Option value={-9999}>全部</Option>
                                    <Option value={1}>待审核</Option>
                                    <Option value={2}>审核通过</Option>
                                    <Option value={3}>审核不通过</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>

                    <Col span={4} className='text-right' >
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