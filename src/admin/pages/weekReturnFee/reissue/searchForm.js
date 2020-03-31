import React, { Component } from 'react';
import { Form, Row, Col, DatePicker, Button, Select, Modal } from 'antd';
import { formItemLayout, formLayout, getFormOptLayout, createFormField } from 'ADMIN_UTILS/searchFormUtil';
import { selectInputSearch } from 'ADMIN_UTILS';
import authority from 'ADMIN_COMPONENTS/Authority';
import resId from 'ADMIN_CONFIG/resId';
import moment from 'moment';

const FormItem = Form.Item;
const { Option } = Select;

class SearchForm extends Component {
    generateTable = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }

            const { tableVisible, handleFormValuesChange, showNewTable } = this.props;

            if (tableVisible) {
                Modal.confirm({
                    title: '生成表格',
                    content: '生成表格将清除原有表格的所有数据。您确定要生成新的表格吗？',
                    onOk: () => {
                        showNewTable();
                        handleFormValuesChange(fieldsValue);
                        window._czc.push(['_trackEvent', '补发返费周薪', '生成表格', '补发返费周薪_N非结算']);
                    }
                });
            } else {
                showNewTable();
                handleFormValuesChange(fieldsValue);
            }
        });
    }

    upDateSettleDate = (which, date) => {
        if (date == null) {
            return;
        }
        let dateC = date.clone();
        if (which == 'start') {
            dateC.add(6, 'days');
            this.props.form.setFieldsValue({
                SettleEndDate: dateC
            });
        } else {
            dateC.subtract(6, 'days');
            this.props.form.setFieldsValue({
                SettleBeginDate: dateC
            });
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formOptLayout = getFormOptLayout(3);
        const { companyList, laborList, tableVisible } = this.props;
        const { canReissueX } = resId.weekReturnFee.reissue;

        return (
            <Form onSubmit={this.generateTable}>
                <Row gutter={15} type="flex" justify="start">
                    <Col {...formLayout}>
                        <Row>
                            <Col span={14}>
                                <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="发薪周期">
                                    {getFieldDecorator('SettleBeginDate', {
                                        rules: [{ required: true }]
                                    })(
                                        <DatePicker
                                            disabled={tableVisible}
                                            allowClear={false}
                                            onChange={this.upDateSettleDate.bind(this, 'start')}
                                            disabledDate={(currentDate) => (currentDate && currentDate.day() != 0 || currentDate.isAfter(moment().subtract(moment().day() + 7, 'days'), 'days'))} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={10}>
                                <FormItem labelCol={{ span: 1 }} wrapperCol={{ span: 23 }} label="-">
                                    {getFieldDecorator('SettleEndDate')(
                                        <DatePicker
                                            disabled={tableVisible}
                                            allowClear={false}
                                            onChange={this.upDateSettleDate.bind(this, 'end')}
                                            disabledDate={(currentDate) => (currentDate && currentDate.day() != 6 || currentDate.isAfter(moment().subtract(moment().day() - 6 + 7, 'days'), 'days'))} />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    </Col>

                    <Col {...formLayout}>
                        <FormItem {...formItemLayout} label='企业'>
                            {getFieldDecorator('EnterpriseID', {
                                rules: [{ required: true, message: '请选择企业' }]
                            })(
                                <Select
                                    disabled={tableVisible}
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
                        <FormItem {...formItemLayout} label='劳务'>
                            {getFieldDecorator('LaborID', {
                                rules: [{ required: true, message: '请选择劳务' }]
                            })(
                                <Select
                                    disabled={tableVisible}
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

                    <Col {...formOptLayout} className="text-right">
                        <FormItem>
                            {authority(canReissueX)(<Button type="primary" htmlType="submit">生成表格</Button>)}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        );
    }
}

SearchForm = Form.create({
    mapPropsToFields: props => (createFormField(props.searchValue))
})(SearchForm);

export default SearchForm;
