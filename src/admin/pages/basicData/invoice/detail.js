import React, { Component, Fragment } from 'react';
import { observer } from "mobx-react";
import { Form, Input, Radio, Modal, Select, message } from 'antd';
import { createFormField } from 'ADMIN_UTILS/searchFormUtil';
import { selectInputSearch } from 'ADMIN_UTILS';
import { canAddInvoice, editInvoice, addInvoice } from 'ADMIN_SERVICE/ZXX_BaseData';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
@observer
class InfoModal extends Component {
    state = {
        sp: undefined,
        ent: undefined,
        canSubmit: true,
        showErrMsg: false
    }

    saveData = (e) => {
        e.preventDefault();
        this.props.form.validateFields(async (err, fieldsValue) => {
            if (err) {
                return;
            }

            const { startQuery, hideDetail } = this.props;
            const reqParam = { ...fieldsValue };
            const operType = reqParam.DataId ? 'edit' : 'add';
            const startAction = (type) => {
                const callFunc = type === 'add' ? addInvoice : editInvoice;
                callFunc(reqParam).then(() => {
                    message.success('操作成功！');
                    hideDetail();
                    startQuery();
                }).catch((err) => {
                    message.error(err.message);
                    console.log(err);
                });
            };

            if (operType === 'add') {
                delete reqParam['DataId'];
                startAction(operType);
                window._czc.push(['_trackEvent', '开票信息', '保存新增', '开票信息_Y结算']);
            } else {
                window._czc.push(['_trackEvent', '开票信息', '保存修改', '开票信息_Y结算']);
                Modal.confirm({
                    title: '',
                    width: 360,
                    content: '提交后该企业-劳务历史的开票信息将会变成无效，是否继续？',
                    onOk: () => {
                        startAction(operType);
                    }
                });
            }
        });
    }

    handleChange = (type, v) => {
        this.setState({
            [type]: v
        }, async () => {
            const { sp, ent } = this.state;
            if (sp && ent) {
                try {
                    const reqParam = { EntId: ent, TrgtSpId: sp };
                    const resData = await canAddInvoice(reqParam);
                    const { Exist } = resData.Data;
                    //  添加过。显示错误信息，禁用按钮
                    if (Exist === 2) {
                        this.setState({
                            canSubmit: false,
                            showErrMsg: true
                        });
                    } else {
                        this.setState({
                            canSubmit: true,
                            showErrMsg: false
                        });
                    }
                } catch (err) {
                    message.error(err.message);
                    console.log(err);
                }
            }
        });
    }

    render() {
        const formItemLayout = { labelCol: { xs: { span: 24 }, sm: { span: 8 } }, wrapperCol: { xs: { span: 24 }, sm: { span: 13 } } };
        const { getFieldDecorator } = this.props.form;
        const {
            detailModal: { show, record },
            hideDetail,
            bankPayAccountList,
            companyList,
            laborList
        } = this.props;
        const { canSubmit, showErrMsg } = this.state;

        return (
            <Modal
                visible={true}
                title={record ? '修改' : '新增'}
                onOk={this.saveData}
                okButtonProps={{ disabled: !canSubmit }}
                onCancel={hideDetail}>
                <Fragment>
                    {showErrMsg && <div className='color-danger text-center mb-8'>该企业-劳务已有开票信息，无法新增</div>}
                    <Form>
                        <FormItem style={{ display: 'none' }}>
                            {getFieldDecorator('DataId')(
                                <Input />
                            )}
                        </FormItem>

                        <FormItem {...formItemLayout} label='劳务'>
                            {getFieldDecorator('TrgtSpId', {
                                rules: [{ required: true, message: '请选择劳务' }]
                            })(
                                <Select
                                    allowClear={true}
                                    placeholder='请选择'
                                    filterOption={selectInputSearch}
                                    optionFilterProp="children"
                                    onChange={this.handleChange.bind(this, 'sp')}
                                    showSearch >
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
                                    onChange={this.handleChange.bind(this, 'ent')}
                                    showSearch >
                                    {
                                        companyList.map((value) => <Option key={value.EntId} value={value.EntId}>{value.EntShortName}</Option>)
                                    }
                                </Select>
                            )}
                        </FormItem>

                        <FormItem {...formItemLayout} label='开票类型'>
                            {getFieldDecorator('InvoiceTyp', {
                                rules: [{ required: true, message: '请选择开票类型' }]
                            })(
                                <RadioGroup buttonStyle="solid">
                                    <RadioButton value={1}>普票</RadioButton>
                                    <RadioButton value={2}>专票</RadioButton>
                                </RadioGroup>
                            )}
                        </FormItem>

                        <FormItem {...formItemLayout} label='劳务名称'>
                            {getFieldDecorator('TrgtCn', {
                                rules: [{ required: true, message: '请输入劳务名称' }]
                            })(
                                <Input maxLength={50} />
                            )}
                        </FormItem>

                        <FormItem {...formItemLayout} label='劳务简称'>
                            {getFieldDecorator('TrgtCnShort', {
                                rules: [{ required: true, message: '请输入劳务简称' }]
                            })(
                                <Input maxLength={50} />
                            )}
                        </FormItem>

                        <FormItem {...formItemLayout} label='企业名称'>
                            {getFieldDecorator('EntCn', {
                                rules: [{ required: true, message: '请输入企业名称' }]
                            })(
                                <Input maxLength={50} />
                            )}
                        </FormItem>

                        <FormItem {...formItemLayout} label='企业简称'>
                            {getFieldDecorator('EntCnShort', {
                                rules: [{ required: true, message: '请输入企业简称' }]
                            })(
                                <Input maxLength={50} />
                            )}
                        </FormItem>

                        <FormItem {...formItemLayout} label='纳税人识别号'>
                            {getFieldDecorator('TaxpayerId', {
                                rules: [{ required: true, message: '请输入纳税人识别号' }]
                            })(
                                <Input maxLength={50} />
                            )}
                        </FormItem>

                        <FormItem {...formItemLayout} label='开户行'>
                            {getFieldDecorator('AccntBank', {
                                rules: [{ required: true, message: '请输入开户行' }]
                            })(
                                <Input maxLength={50} />
                            )}
                        </FormItem>

                        <FormItem {...formItemLayout} label='开户账号'>
                            {getFieldDecorator('AccntNum', {
                                rules: [{ required: true, message: '请输入开户账号' }]
                            })(
                                <Input maxLength={50} />
                            )}
                        </FormItem>

                        <FormItem {...formItemLayout} label='联系电话'>
                            {getFieldDecorator('TelPhone', {
                                rules: [{ required: true, message: '请输入联系电话' }]
                            })(
                                <Input maxLength={50} />
                            )}
                        </FormItem>

                        <FormItem {...formItemLayout} label='地址'>
                            {getFieldDecorator('Address', {
                                rules: [{ required: true, message: '请输入地址' }]
                            })(
                                <Input maxLength={50} />
                            )}
                        </FormItem>
                    </Form>
                </Fragment>
            </Modal>
        );
    }
}

InfoModal = Form.create({
    mapPropsToFields: props => {
        const { record } = props.detailModal;
        if (record) {
            return createFormField(record);
        }
    }
})(InfoModal);

export default InfoModal;