import React, { Component } from 'react';
import { observer } from "mobx-react";
import { Form, Input, Radio, Modal, Select } from 'antd';
import { createFormField } from 'ADMIN_UTILS/searchFormUtil';
import { selectInputSearch } from 'ADMIN_UTILS';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
@observer
class InfoModal extends Component {
    state = {
        ent: '',
        sp: '',
        month: ''
    }

    componentDidMount() {
        const { record } = this.props.infoModal;
        if (record) {
            this.setState({
                ent: record.EntName,
                sp: record.SpName,
                month: record.BelongMonths
            });
        }
    }

    handleSubChange = (which, val) => {
        if (which == 'month') {
            val = val ? val.target.value : '';
        } else {
            val = val ? val.label : '';
        }

        this.setState({
            [which]: val
        }, () => {
            this.props.form.setFieldsValue({
                BankVirtualSubAccntName: this.state.sp + '-' + this.state.ent + '-' + this.state.month + '月份'
            });
        });
    }

    saveData = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }

            this.props.saveData(fieldsValue);
        });
    }

    render() {
        const formItemLayout = { labelCol: { xs: { span: 24 }, sm: { span: 8 } }, wrapperCol: { xs: { span: 24 }, sm: { span: 13 } } };
        const { getFieldDecorator } = this.props.form;
        const {
            infoModal: { show, record },
            setInfoModalShow,
            bankPayAccountList,
            companyList,
            laborList
        } = this.props;

        return (
            <Modal
                visible={true}
                title={record ? '修改' : '新增'}
                onOk={this.saveData}
                onCancel={setInfoModalShow.bind(this, false)}>
                <Form onSubmit={this.saveData}>
                    <FormItem style={{ display: 'none' }}>
                        {getFieldDecorator('PayAccntRouterId')(
                            <Input />
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label='劳务'>
                        {getFieldDecorator('SpId', {
                            rules: [{ required: true, message: '请选择劳务' }]
                        })(
                            <Select
                                allowClear={true}
                                placeholder='请选择'
                                filterOption={selectInputSearch}
                                optionFilterProp="children"
                                showSearch
                                labelInValue
                                onChange={this.handleSubChange.bind(this, 'sp')}>
                                {
                                    laborList.map((value) => <Option key={value.SpId} value={value.SpId}>{value.SpShortName}</Option>)
                                }
                            </Select>
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label='企业'>
                        {getFieldDecorator('EntId', {
                            rules: [{ required: true, message: '请选择企业' }]
                        })(
                            <Select
                                allowClear={true}
                                placeholder='请选择'
                                filterOption={selectInputSearch}
                                optionFilterProp="children"
                                showSearch
                                labelInValue
                                onChange={this.handleSubChange.bind(this, 'ent')}>
                                {
                                    companyList.map((value) => <Option key={value.EntId} value={value.EntId}>{value.EntShortName}</Option>)
                                }
                            </Select>
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label='付款账号名称'>
                        {getFieldDecorator('PayAccntId', {
                            rules: [{ required: true, message: '请选择付款账号名称' }]
                        })(
                            <Select
                                allowClear={true}
                                placeholder='请选择'
                                filterOption={selectInputSearch}
                                optionFilterProp="children"
                                showSearch>
                                {
                                    bankPayAccountList.map((value) => <Option key={value.PayAccntId} value={value.PayAccntId}>{value.BankAccntName}</Option>)
                                }
                            </Select>
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label='归属月份'>
                        {getFieldDecorator('BelongMonths', {
                            rules: [{ required: true, message: '请选择归属月份' }]
                        })(
                            <RadioGroup buttonStyle="solid" onChange={this.handleSubChange.bind(this, 'month')}>
                                <RadioButton value="1,4,7,10">1,4,7,10月份</RadioButton>
                                <RadioButton value="2,5,8,11">2,5,8,11月份</RadioButton>
                                <RadioButton value="3,6,9,12">3,6,9,12月份</RadioButton>
                            </RadioGroup>
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label='银行虚拟子账户'>
                        {getFieldDecorator('BankVirtualSubAccnt', {
                            rules: [{ required: true, message: '请输入银行虚拟子账户' }]
                        })(
                            <Input maxLength={10} placeholder='请输入' />
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label='银行虚拟子账户名称'>
                        {getFieldDecorator('BankVirtualSubAccntName', {
                            rules: [{ required: true, message: '请输入银行虚拟子账户名称' }]
                        })(
                            <Input maxLength={10} disabled />
                        )}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

InfoModal = Form.create({
    mapPropsToFields: props => {
        const { record } = props.infoModal;
        if (record) {
            const { EntId, EntShortName, SpId, SpShortName } = { ...record };
            return createFormField({
                ...record,
                EntId: {
                    key: EntId,
                    label: EntShortName
                },
                SpId: {
                    key: SpId,
                    label: SpShortName
                }
            });
        }
    }
})(InfoModal);

export default InfoModal;