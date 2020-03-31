import React, { Component } from 'react';
import { observer } from "mobx-react";
import { Form, Row, Col, DatePicker, Button, Select, Input } from 'antd';
import { getFormOptLayout, formItemLayout, formLayout, createFormField } from 'ADMIN_UTILS/searchFormUtil';
import { selectInputSearch } from 'ADMIN_UTILS';

const FormItem = Form.Item;
const Option = Select.Option;

class conFIlterSearchForm extends Component {
    constructor(props) {
        super(props);
    }

    startQueryFilterTable = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            // let { EntId, IntvDtEnd, IntvDtStart, WorkSts, TrgtSpId } = fieldsValue;
            // let param = {
            //     EntId, IntvDtEnd, IntvDtStart, WorkSts, TrgtSpId
            // }
            const { startQueryFilterTable, resetPageCurrent } = this.props;
            resetPageCurrent();
            startQueryFilterTable();
            window._czc.push(['_trackEvent', '公告推送管理', '查询', '公告推送管理_N非结算']);
        });
    }

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const formOptLayout = getFormOptLayout(7);
        const { agentList, companyList, laborList, resetMemberForm } = this.props;

        return (
            <Form onSubmit={this.startQueryFilterTable}>
                <Row gutter={15} type="flex" justify="start">
                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='劳务'>
                            {getFieldDecorator('TrgtSpId')(
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


                    <Col {...formLayout}>
                        <Row>
                            <Col span={14}>
                                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="面试时间">
                                    {getFieldDecorator('IntvDtStart')(
                                        <DatePicker disabledDate={(startValue) => {
                                            const endValue = getFieldValue('IntvDtEnd');
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
                                    {getFieldDecorator('IntvDtEnd')(
                                        <DatePicker disabledDate={(endValue) => {
                                            const startValue = getFieldValue('IntvDtStart');
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
                        <FormItem {...formItemLayout} label='在职状态'>
                            {getFieldDecorator('WorkSts')(
                                <Select
                                allowClear={true}
                                placeholder='请选择'
                                filterOption={selectInputSearch}
                                optionFilterProp="children"
                                showSearch>
                                    <Option value={1}>在职</Option>
                                    <Option value={2}>离职</Option>
                                    <Option value={3}>转正</Option>
                                    <Option value={4}>未处理</Option>
                                    <Option value={5}>未知</Option>
                                    <Option value={6}>自离</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col className='conFilter'>
                        <FormItem>
                            <Button onClick={resetMemberForm} >重置</Button>
                            <Button type="primary" htmlType="submit" className="ml-8">查询</Button>
                        </FormItem>
                    </Col>

                </Row>
            </Form>
        );
    }
}

conFIlterSearchForm = Form.create({
    mapPropsToFields: props => (createFormField(props.filterSearchValue)),
    onValuesChange: (props, changedValues, allValues) => (props.handleFormFilterValuesChange(allValues))
})(conFIlterSearchForm);

export default conFIlterSearchForm;