import React, { Component } from 'react';
import { observer } from "mobx-react";
import { Form, Input, Modal, Select } from 'antd';
import { createFormField } from 'ADMIN_UTILS/searchFormUtil';
import { selectInputSearch } from 'ADMIN_UTILS';

const FormItem = Form.Item;
const { Option } = Select;

@observer
class InfoModal extends Component {
    state = {
        sp: '',
        subname: ''
    }

    componentDidMount() {
        const { record } = this.props.agentPayAccountStore.view.infoModal;
        if(record) {
            this.setState({
                sp: record.SpName,
                subname: record.BankVirtualSubAccnt
            });
        }
    }

    handleSubChange = (which, val) => {
        if (which == 'subname') {
            val = val ? val.target.value : '';
        } else {
            val = val ? val.label : '';
        }

        this.setState({
            [which]: val
        }, () => {
            this.props.form.setFieldsValue({
                BankVirtualSubAccntName: this.state.sp + '-' + this.state.subname
            });
        });
    }

    saveData = (e) => {
        const {
            view: {
                infoModal: { record }
            }
        } = this.props.agentPayAccountStore;
        e.preventDefault();
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            window._czc.push(['_trackEvent', '中介打款虚拟子账户', record ? '保存修改' : '保存新增', '中介打款虚拟子账户_N非结算']);
            this.props.agentPayAccountStore.saveData(fieldsValue);
        });
    }

    render() {
        const formItemLayout = { labelCol: { xs: { span: 24 }, sm: { span: 8 } }, wrapperCol: { xs: { span: 24 }, sm: { span: 10 } } };

        const { getFieldDecorator } = this.props.form;
        const {
            view: {
                infoModal: { record }
            },
            setInfoModalShow
        } = this.props.agentPayAccountStore;
        const { bankPayAccountList, agentList } = this.props.globalStore;

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

                    <FormItem {...formItemLayout} label='中介'>
                        {getFieldDecorator('SpId', {
                            rules: [{ required: true, message: '请选择中介' }]
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
                                    agentList.map((value) => {
                                        return <Option key={value.SpId} value={value.SpId}>{value.SpShortName}</Option>;
                                    })
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
                                    bankPayAccountList.map((value) => {
                                        return <Option key={value.PayAccntId} value={value.PayAccntId}>{value.BankAccntName}</Option>;
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>

                    <FormItem {...formItemLayout} label='银行虚拟子账户'>
                        {getFieldDecorator('BankVirtualSubAccnt', {
                            rules: [{ required: true, message: '请输入银行虚拟子账户' }]
                        })(
                            <Input maxLength={10} placeholder='请输入' onChange={this.handleSubChange.bind(this, 'subname')}/>
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
        const { record } = props.agentPayAccountStore.view.infoModal;
        if (record) {
            const { SpId, SpShortName } = { ...record };
            return createFormField({
                ...record,
                SpId: {
                    key: SpId,
                    label: SpShortName
                }
            });
        }
    }
})(InfoModal);

export default InfoModal;