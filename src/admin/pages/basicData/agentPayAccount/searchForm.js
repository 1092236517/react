import React, { Component } from 'react';
import { observer } from "mobx-react";
import { Form, Row, Col, Button, Select } from 'antd';
import { getFormOptLayout, formItemLayout, formLayout, createFormField } from 'ADMIN_UTILS/searchFormUtil';
import { selectInputSearch } from 'ADMIN_UTILS';

const FormItem = Form.Item;
const Option = Select.Option;

@observer
class SearchForm extends Component {
    startQuery = (e) => {
        e.preventDefault();
        window._czc.push(['_trackEvent', '中介打款虚拟子账户', '查询', '中介打款虚拟子账户_N非结算']);
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }

            const { startQuery, resetPageCurrent } = this.props.agentPayAccountStore;
            resetPageCurrent();
            startQuery();
        });
    }

    handleReset = (e) => {
        const { resetFields, setFieldsValue } = this.props.form;
        resetFields();
        // 手动清空，触发form的onValuesChange事件
        setFieldsValue({
            SpId: undefined
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formOptLayout = getFormOptLayout(1);
        const { agentList } = this.props.globalStore;

        return (
            <Form onSubmit={this.startQuery}>
                <Row gutter={15} type="flex" justify="start">
                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='中介'>
                            {getFieldDecorator('SpId')(
                                <Select
                                    allowClear={true}
                                    placeholder='请选择'
                                    filterOption={selectInputSearch}
                                    optionFilterProp="children"
                                    showSearch>
                                    {
                                        agentList.map((value) => {
                                            return <Option key={value.SpId} value={value.SpId}>{value.SpShortName}</Option>;
                                        })
                                    }
                                </Select>
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
        const { view: { searchValue } } = props.agentPayAccountStore;
        return createFormField(searchValue);
    },
    onValuesChange: (props, changedValues, allValues) => {
        props.agentPayAccountStore.handleFormValuesChange(allValues);
    }
})(SearchForm);

export default SearchForm;